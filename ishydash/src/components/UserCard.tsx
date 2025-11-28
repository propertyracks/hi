"use client";

interface UserCardProps {
  nickname?: string | null;
  status: "idle" | "queued" | "chatting";
  onQueueClick?: () => void;
  onLeaveClick?: () => void;
  loading?: boolean;
}

export function UserCard({
  nickname,
  status,
  onQueueClick,
  onLeaveClick,
  loading = false,
}: UserCardProps) {
  const statusConfig = {
    idle: {
      text: "Ready",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      icon: "✨",
    },
    queued: {
      text: "Finding Friend...",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      icon: "🔍",
    },
    chatting: {
      text: "In Chat",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      icon: "💭",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="glow-card p-8 semi-rounded-xl mb-8 max-w-md mx-auto sm:mx-0">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#693b54] flex items-center justify-center text-2xl font-bold text-white">
          {nickname?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#e8e9f3] truncate">
            {nickname || "Anonymous"}
          </h3>
          <div className={`inline-flex items-center gap-2 ${current.bg} ${current.color} px-3 py-1 rounded-full text-sm font-medium`}>
            <span>{current.icon}</span>
            {current.text}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {status === "idle" && (
          <button
            onClick={onQueueClick}
            disabled={loading}
            className="w-full glow-button bg-[#693b54] text-white font-bold py-3 semi-rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:bg-[#7a4a63]"
          >
            {loading ? "Queuing..." : "Find Friend"}
          </button>
        )}

        {(status === "queued" || status === "chatting") && (
          <button
            onClick={onLeaveClick}
            disabled={loading}
            className="w-full bg-red-500/20 border border-red-500/50 text-red-400 font-bold py-3 semi-rounded-lg hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Leaving..." : "Leave"}
          </button>
        )}
      </div>
    </div>
  );
}
