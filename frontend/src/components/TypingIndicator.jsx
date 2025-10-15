import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-800 border border-gray-200 px-6 py-4 rounded-2xl">
        <div className="text-sm mb-2 text-gray-600 font-medium">AI Assistant</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">AI is typing</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}