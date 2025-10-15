import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

export default function ChatArea({ messages, loading, onRegenerateResponse, onCopyMessage }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              onRegenerate={() => onRegenerateResponse(message.id)}
              onCopy={() => onCopyMessage(message.content)}
            />
          ))
        )}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}