"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Type command (e.g., "/find friends")' }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#693b54]/20 rounded-xl blur-lg transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative bg-[#2d2b2c] border border-[#3d3b3c] rounded-xl flex items-center px-4 py-3 hover:border-[#693b54]/50 transition-colors duration-300">
          <svg
            className="w-5 h-5 text-[#693b54] mr-3 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[#e8e9f3] placeholder-[#b0b0c0] focus:outline-none font-medium text-sm"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className={`ml-3 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 ${
              input.trim()
                ? "bg-[#693b54] text-white glow-button cursor-pointer hover:shadow-lg hover:bg-[#7a4a63]"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
