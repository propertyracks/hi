"use client";

interface StatsPanelData {
  queue: number;
  active_chats: number;
  blocks: number;
}

interface StatsPanelProps {
  stats: StatsPanelData | null;
  loading?: boolean;
}

export function StatsPanel({ stats, loading = false }: StatsPanelProps) {
  const statItems = [
    {
      label: "In Queue",
      value: stats?.queue ?? 0,
      icon: "👥",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Active Chats",
      value: stats?.active_chats ?? 0,
      icon: "💬",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Blocks",
      value: stats?.blocks ?? 0,
      icon: "🚫",
      color: "from-pink-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="glow-card p-6 semi-rounded-lg transform transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b0b0c0] text-sm font-medium mb-1">
                {item.label}
              </p>
              <p
                className={`text-3xl font-bold text-[#693b54]`}
              >
                {loading ? "..." : item.value}
              </p>
            </div>
            <span className="text-3xl">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
