import React from 'react';
import { MessageSquare, Zap, Shield, Sparkles } from 'lucide-react';

export default function EmptyState() {
  const suggestions = [
    { icon: MessageSquare, text: "Explain quantum computing", color: "text-blue-500" },
    { icon: Zap, text: "Write a Python function", color: "text-yellow-500" },
    { icon: Shield, text: "Help me debug my code", color: "text-green-500" },
    { icon: Sparkles, text: "Create a creative story", color: "text-purple-500" }
  ];

  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <MessageSquare size={48} className="text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Start a Conversation
        </h3>
        <p className="text-gray-600 text-lg">
          Ask me anything, I'm here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
            >
              <Icon size={24} className={`${suggestion.color} group-hover:scale-110 transition`} />
              <span className="text-gray-700 text-left">{suggestion.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
