import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-800 border border-gray-200 px-6 py-4 rounded-2xl">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}