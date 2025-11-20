import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function InputBar({ inputText, onInputChange, onSend, loading }) {
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [inputText]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="
      sticky bottom-0 
      bg-white 
      border-t border-gray-200 
      p-4 
      shadow-lg
      z-20
    ">
      <div className="max-w-4xl mx-auto flex gap-4">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift + Enter for new line)"
          className="
            flex-1 
            px-4 py-3 
            border border-gray-300 
            rounded-xl 
            focus:ring-2 focus:ring-blue-500 
            focus:border-transparent 
            outline-none 
            resize-none 
            overflow-hidden
            bg-white
          "
          rows={1}
          style={{ minHeight: "48px", maxHeight: "200px" }}
          disabled={loading}
        />

        <button
          onClick={onSend}
          disabled={!inputText.trim() || loading}
          className="
            px-6 py-3 
            bg-blue-600 text-white 
            rounded-xl 
            hover:bg-blue-700 
            transition 
            disabled:opacity-50 disabled:cursor-not-allowed 
            flex items-center gap-2 
            font-semibold
          "
        >
          <Send size={20} />
          Send
        </button>
      </div>
    </div>
  );
}
