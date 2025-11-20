import React from 'react';
import { Plus } from 'lucide-react';



export default function Sidebar({ 
  sessions, 
  activeSessionId, 
  onSessionClick, 
  onNewChat, 
  onDeleteSession,
  onRenameSession,
  onTogglePin,
  isOpen 
}) {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No chat sessions yet
          </div>
        ) : (
          sessions.map(session => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={activeSessionId === session.id}
              onClick={() => onSessionClick(session.id)}
              onDelete={() => onDeleteSession(session.id)}
              onRename={(newTitle) => onRenameSession(session.id, newTitle)}
              onTogglePin={() => onTogglePin(session.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

