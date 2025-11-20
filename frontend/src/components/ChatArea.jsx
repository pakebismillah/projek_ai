import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import EmptyState from "./EmptyState";

export default function ChatArea({ 
  activeSessionId, 
  messages = [],
  onCopyMessage
}) {

  const bottomRef = useRef(null);

  // Auto scroll ke bawah saat pesan bertambah atau session berubah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSessionId]);

  if (!activeSessionId) return <EmptyState />;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">

      {messages.length === 0 && (
        <p className="text-center text-gray-400">Belum ada pesan...</p>
      )}

      {messages.map((msg, index) => (
        <MessageBubble 
          key={msg.id || msg._id || index}
          message={msg}
          onCopyMessage={onCopyMessage}
        />
      ))}

      {/* Auto scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
