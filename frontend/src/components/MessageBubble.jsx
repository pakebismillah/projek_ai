import React from "react";

export default function MessageBubble({ message, onRegenerate, onCopy }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl p-4 rounded-2xl shadow 
        ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {!isUser && (
          <div className="flex gap-3 mt-3 text-sm">
            <button
              onClick={onRegenerate}
              className="text-blue-500 hover:underline"
            >
              Regenerate
            </button>
            <button
              onClick={onCopy}
              className="text-blue-500 hover:underline"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
