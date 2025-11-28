"use client";

import React from "react";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
  loading?: boolean;
}

export function NicknameModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: NicknameModalProps) {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && input.length >= 2 && input.length <= 32) {
      onSubmit(input);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glow-card semi-rounded-xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-[#e8e9f3] mb-4">Set Nickname</h2>
        <p className="text-[#b0b0c0] text-sm mb-6">
          Choose a nickname (2-32 characters) to display to other users
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={32}
            placeholder="Your nickname"
            className="w-full bg-[#0f0f1e] border border-[#2d2d5f] rounded-lg px-4 py-2 text-[#e8e9f3] placeholder-[#b0b0c0] focus:outline-none focus:border-cyan-500 transition-colors"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-700/50 text-[#e8e9f3] font-semibold py-2 semi-rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !input.trim() ||
                input.length < 2 ||
                input.length > 32
              }
              className="flex-1 glow-button bg-[#693b54] text-white font-semibold py-2 semi-rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a4a63]"
            >
              {loading ? "Setting..." : "Set"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
