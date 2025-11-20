// frontend/pages/ChatPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../api";

export default function ChatPage({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    data: null,
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        const fetchedSessions = res.data || [];
        setSessions(fetchedSessions);

        if (fetchedSessions.length > 0 && !activeSessionId) {
          setActiveSessionId(fetchedSessions[0].id);
        }
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, []); // ✅ BENAR — cuma load sekali

  // 🔹 Load pesan ketika activeSessionId berubah
  useEffect(() => {
    if (!activeSessionId) return;

    async function loadMessages() {
      try {
        const res = await api.get(`/chats/${activeSessionId}`);
        const formatted = (res.data || []).map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
        }));

        setMessages((prev) => ({
          ...prev,
          [activeSessionId]: formatted,
        }));
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    }

    loadMessages();
  }, [activeSessionId]);

  // 🔹 Buat session baru
  const createNewSession = async () => {
    try {
      const res = await api.post("/sessions", { title: "Percakapan Baru" });
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      setMessages((prev) => ({ ...prev, [newSession.id]: [] }));
      setActiveSessionId(newSession.id);
    } catch (err) {
      console.error("❌ Error creating session:", err);
    }
  };

  // 🔹 rename session
  const renameSession = async (sessionId, newTitle) => {
  try {
    await api.put(`/sessions/${sessionId}`, { title: newTitle });

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, title: newTitle } : s
      )
    );
  } catch (err) {
    console.error("❌ Error renaming session:", err);
  }
};


  // 🔹 Hapus session
  const deleteSession = (sessionId) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete_session",
      data: sessionId,
      title: "Hapus Percakapan",
      message: "Apakah kamu yakin ingin menghapus percakapan ini?",
    });
  };

  const confirmDeleteSession = async () => {
    const sessionId = confirmDialog.data;
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setMessages((prev) => {
        const copy = { ...prev };
        delete copy[sessionId];
        return copy;
      });

      if (activeSessionId === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        if (remaining.length > 0) setActiveSessionId(remaining[0].id);
        else createNewSession();
      }
    } catch (err) {
      console.error("❌ Error deleting session:", err);
    }
    setConfirmDialog({ isOpen: false, type: "", data: null });
  };

  // In ChatPage.jsx, modify the sendMessage function
  const sendMessage = async () => {
    if (!inputText.trim() || loading || !activeSessionId) return;

    const newUserMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    // tampilkan pesan user dulu
    setMessages((prev) => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newUserMessage],
    }));

    const savedInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      // POST ke endpoint yang benar
      const res = await api.post(`/chats`, {
        sessionId: activeSessionId,
        message: savedInput,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      };

      // tampilkan AI message
      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), aiMessage],
      }));

      // update title kalau baru
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId && s.title === "Percakapan Baru"
            ? {
                ...s,
                title:
                  savedInput.slice(0, 30) +
                  (savedInput.length > 30 ? "..." : ""),
              }
            : s
        )
      );

      // 🚀 setelah post → GET pesan terbaru dari database
      const refresh = await api.get(`/chats/${activeSessionId}`);
      const formatted = (refresh.data || []).map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      }));

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: formatted,
      }));
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: (prev[activeSessionId] || []).slice(0, -1),
      }));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Copy pesan
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  // 🔹 Logout
  const handleLogoutClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: "logout",
      title: "Logout",
      message: "Apakah kamu yakin ingin logout?",
    });
  };

  const confirmLogout = () => {
    setConfirmDialog({ isOpen: false, type: "", data: null });
    onLogout();
  };

  // 🔹 Urutkan session (baru dulu)
  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [sessions]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300`}
      >
        <Sidebar
          sessions={sortedSessions}
          activeSessionId={activeSessionId}
          onSessionClick={setActiveSessionId}
          onNewChat={createNewSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          onTogglePin={() => {}}
          isOpen={sidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar
          user={user}
          onLogout={handleLogoutClick}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <ChatArea
          activeSessionId={activeSessionId}
          messages={messages[activeSessionId] || []}
          onCopyMessage={copyMessage}
        />

        <InputBar
          inputText={inputText}
          onInputChange={setInputText}
          onSend={sendMessage}
          loading={loading}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={
          confirmDialog.type === "delete_session"
            ? confirmDeleteSession
            : confirmLogout
        }
        onCancel={() =>
          setConfirmDialog({ isOpen: false, type: "", data: null })
        }
      />
    </div>
  );
}
