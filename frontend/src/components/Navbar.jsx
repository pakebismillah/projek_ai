import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar, sidebarOpen }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Hi, {user?.name || user?.email?.split('@')[0] || "User"} 👋
        </h2>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
