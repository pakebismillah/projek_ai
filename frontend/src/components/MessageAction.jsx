import React, { useState } from 'react';
import MessageActions from './MessageActions';

export default function MessageBubble({ message, onRegenerate, onCopy }) {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative max-w-2xl">
        <div
          className={`px-6 py-4 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          <div className="text-sm mb-1 opacity-70 font-medium">
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        </div>

        {/* Message Actions */}
        {isHovered && (
          <MessageActions
            isUser={isUser}
            onCopy={onCopy}
            onRegenerate={!isUser ? onRegenerate : undefined}
          />
        )}
      </div>
    </div>
  );
}