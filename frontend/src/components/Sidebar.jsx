import React from "react";
import { Trash2, Edit3 } from "lucide-react";

export default function Sidebar({
  sessions = [],
  activeSessionId,
  onSessionClick,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  isOpen,
}) {
  return (
    <div
      className={`h-full bg-gray-900 text-white flex flex-col 
  transition-all duration-300 overflow-hidden
  ${isOpen ? "w-64" : "w-0"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <button
          onClick={onNewChat}
          className="bg-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-700"
        >
          + New Chat
        </button>
      </div>

      {/* List sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <p className="p-4 text-gray-400">Belum ada sesi</p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className={`group flex items-center justify-between px-4 py-3 border-b border-gray-800 cursor-pointer
                ${
                  activeSessionId === s.id ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
            >
              {/* klik area untuk pilih session */}
              <div
                className="flex-1 truncate"
                onClick={() => onSessionClick(s.id)}
              >
                {s.title || "Untitled Chat"}
              </div>

              {/* tombol edit (muncul saat hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // supaya ga ikut milih session
                  const newTitle = prompt("Nama baru:", s.title);
                  if (newTitle && newTitle.trim()) {
                    onRenameSession(s.id, newTitle.trim());
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-yellow-600 rounded transition mr-1"
              >
                <Edit3 size={16} />
              </button>

              {/* tombol delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(s.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
