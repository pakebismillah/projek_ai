// frontend/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
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
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: "", data: null });

  // 🔹 Load semua session user dari backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data || []);
        if (res.data.length > 0) {
          setActiveSessionId(res.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, []);

  // 🔹 Load pesan dari session aktif
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeSessionId) return;
      try {
        const res = await api.get(`/messages/${activeSessionId}`);
        setMessages((prev) => ({ ...prev, [activeSessionId]: res.data || [] }));
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [activeSessionId]);

  // 🔹 Buat session baru di backend
  const createNewSession = async () => {
    try {
      const res = await api.post("/sessions", { title: "New Chat" });
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      setMessages((prev) => ({ ...prev, [newSession.id]: [] }));
      setActiveSessionId(newSession.id);
    } catch (err) {
      console.error("Error creating session:", err);
    }
  };

  // 🔹 Hapus session dari backend
  const deleteSession = (sessionId) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete_session",
      data: sessionId,
      title: "Delete Chat Session",
      message: "Are you sure you want to delete this chat? This action cannot be undone.",
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
      console.error("Error deleting session:", err);
    }
    setConfirmDialog({ isOpen: false, type: "", data: null });
  };

  // 🔹 Rename session di backend
  const renameSession = async (sessionId, newTitle) => {
    try {
      await api.put(`/sessions/${sessionId}`, { title: newTitle });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
      );
    } catch (err) {
      console.error("Error renaming session:", err);
    }
  };

  // 🔹 Pin/unpin session (opsional)
  const togglePinSession = async (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    try {
      await api.put(`/sessions/${sessionId}`, { isPinned: !session.isPinned });
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
        )
      );
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  // 🔹 Kirim pesan ke backend
  const sendMessage = async () => {
    if (!inputText.trim() || loading || !activeSessionId) return;

    const newUserMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newUserMessage],
    }));

    const savedInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      const res = await api.post(`/messages/${activeSessionId}`, {
        content: savedInput,
      });

      const aiMessage = res.data;
      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), aiMessage],
      }));

      // update judul session
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId && s.messageCount === 0
            ? { ...s, title: savedInput.slice(0, 30) }
            : s
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Regenerate AI response
  const regenerateResponse = async (messageId) => {
    try {
      setLoading(true);
      const res = await api.post(`/messages/${activeSessionId}/regenerate`, {
        messageId,
      });
      const newResponse = res.data;

      setMessages((prev) => {
        const updated = [...(prev[activeSessionId] || [])];
        const idx = updated.findIndex((m) => m.id === messageId);
        if (idx !== -1) updated[idx] = newResponse;
        return { ...prev, [activeSessionId]: updated };
      });
    } catch (err) {
      console.error("Error regenerating message:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Copy message
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  // 🔹 Logout confirm
  const handleLogoutClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: "logout",
      title: "Logout",
      message: "Are you sure you want to logout?",
    });
  };

  const confirmLogout = () => {
    setConfirmDialog({ isOpen: false, type: "", data: null });
    onLogout();
  };

  // 🔹 Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const activeMessages = messages[activeSessionId] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sessions={sortedSessions}
        activeSessionId={activeSessionId}
        onSessionClick={setActiveSessionId}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        onTogglePin={togglePinSession}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          user={user}
          onLogout={handleLogoutClick}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <ChatArea
          messages={activeMessages}
          loading={loading}
          onRegenerateResponse={regenerateResponse}
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
        onCancel={() => setConfirmDialog({ isOpen: false, type: "", data: null })}
      />
    </div>
  );
}
