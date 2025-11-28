"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { StatsPanel } from "@/components/StatsPanel";
import { UserCard } from "@/components/UserCard";
import { NicknameModal } from "@/components/NicknameModal";
import { api } from "@/lib/api";

interface UserStatus {
  in_queue: boolean;
  in_chat: boolean;
  partner_id: string | null;
  nickname: string | null;
}

interface Stats {
  queue: number;
  active_chats: number;
  blocks: number;
}

export default function FriendBoard() {
  const [userId, setUserId] = useState<string>("");
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user ID from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ishy_user_id");
    if (stored) {
      setUserId(stored);
    }
  }, []);

  // Refresh stats periodically
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      refreshStats();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const refreshStats = async () => {
    if (!userId) return;
    try {
      setStatsLoading(true);
      const response = await api.getStatus();
      setStats({
        queue: response.queue || 0,
        active_chats: response.active_chats || 0,
        blocks: response.blocks || 0,
      });
    } catch (err) {
      console.error("Failed to refresh stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const refreshUserStatus = async (id: string) => {
    try {
      const response = await api.getMe(id);
      setUserStatus({
        in_queue: response.in_queue,
        in_chat: response.in_chat,
        partner_id: response.partner_id,
        nickname: response.nickname,
      });
    } catch (err) {
      console.error("Failed to refresh user status:", err);
    }
  };

  const handleSetUserId = async (id: string) => {
    setUserId(id);
    localStorage.setItem("ishy_user_id", id);
    setShowNicknameModal(true);
    await refreshUserStatus(id);
    await refreshStats();
  };

  const handleSearch = async (query: string) => {
    const id = query.trim();

    if (!id.match(/^\d+$/)) {
      setError("Please enter a valid user ID (numbers only)");
      return;
    }

    handleSetUserId(id);
  };

  const handleFindFriend = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.queue(userId, userStatus?.nickname || undefined);

      if (response.status === "matched") {
        setSuccessMessage(
          `Matched with partner! ID: ${response.partner_id}`
        );
      } else if (response.status === "queued") {
        setSuccessMessage("Added to queue! Searching for a friend...");
      } else if (response.status === "already_chatting") {
        setError("You're already in a chat");
      } else if (response.status === "already_queued") {
        setError("You're already in the queue");
      }

      await refreshUserStatus(userId);
      await refreshStats();
    } catch (err: any) {
      setError(err.message || "Failed to find friend");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.leave(userId);

      if (response.status === "ended_chat") {
        setSuccessMessage("Left the chat");
      } else if (response.status === "left_queue") {
        setSuccessMessage("Left the queue");
      }

      await refreshUserStatus(userId);
      await refreshStats();
    } catch (err: any) {
      setError(err.message || "Failed to leave");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNickname = async (nickname: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.setNickname(userId, nickname);

      if (response.status === "ok") {
        setSuccessMessage(`Nickname set to "${response.nickname}"`);
        await refreshUserStatus(userId);
      }

      setShowNicknameModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to set nickname");
    } finally {
      setLoading(false);
    }
  };

  const userStatusMap = userStatus
    ? userStatus.in_chat
      ? ("chatting" as const)
      : userStatus.in_queue
      ? ("queued" as const)
      : ("idle" as const)
    : ("idle" as const);

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-[#e8e9f3] overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#693b54]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5a2e47]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-[#7a4a63]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#693b54]/30 bg-[#693b54]/10">
              <span className="text-[#693b54] text-xl">⚡</span>
              <span className="text-[#7a4a63] text-sm font-semibold">
                Friend Board
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3 text-[#693b54] leading-tight">
            Ishy Friend Board
          </h1>
          <p className="text-[#b0b0c0] text-lg mb-8 max-w-2xl mx-auto">
            Find friends anonymously and start chatting instantly. Just enter your user ID and get started!
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-12">
          <SearchBar
            onSearch={handleSearch}
            placeholder={
              userId
                ? `Your ID: ${userId}`
                : 'Enter your user ID (Discord ID)'
            }
          />
        </div>

        {/* User not logged in state */}
        {!userId && (
          <div className="glow-card semi-rounded-xl p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold mb-3">Welcome to Ishy</h2>
            <p className="text-[#b0b0c0] mb-6">
              Enter your Discord user ID in the search bar above to get started finding friends!
            </p>
            <p className="text-[#7a7a8a] text-sm">
              Don't have your ID? Right-click your username on Discord and select "Copy User ID"
            </p>
          </div>
        )}

        {/* User logged in state */}
        {userId && (
          <>
            {/* Status messages */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 semi-rounded">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 semi-rounded">
                {successMessage}
              </div>
            )}

            {/* Stats */}
            <StatsPanel stats={stats} loading={statsLoading} />

            {/* User card and actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-1">
                <UserCard
                  nickname={userStatus?.nickname}
                  status={userStatusMap}
                  onQueueClick={handleFindFriend}
                  onLeaveClick={handleLeave}
                  loading={loading}
                />

                <button
                  onClick={() => setShowNicknameModal(true)}
                  className="w-full mt-4 px-4 py-2 text-center bg-[#2d2b2c] border border-[#3d3b3c] text-[#b0b0c0] rounded-lg hover:border-[#693b54]/50 hover:text-[#e8e9f3] transition-colors text-sm font-medium"
                >
                  Change Nickname
                </button>
              </div>

              {/* Info panel */}
              <div className="lg:col-span-2">
                <div className="glow-card p-6 md:p-8 semi-rounded-lg space-y-4">
                  <h3 className="text-xl font-bold text-[#e8e9f3]">About</h3>

                  <div className="space-y-3 text-[#b0b0c0] text-sm">
                    <p>
                      <span className="text-cyan-400 font-semibold">Ishy</span> is
                      an anonymous friend-finding platform. Connect with random users
                      and have meaningful conversations without revealing your identity
                      (unless you choose to).
                    </p>

                    <div className="pt-4 space-y-3 border-t border-[#2d2d5f]">
                      <div>
                        <p className="font-semibold text-[#e8e9f3] mb-1">
                          Your User ID
                        </p>
                        <p className="font-mono bg-[#0f0f1e] p-2 rounded">
                          {userId}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#e8e9f3] mb-1">
                          Current Status
                        </p>
                        <p className="capitalize">
                          {userStatusMap === "idle"
                            ? "Ready to find friends"
                            : userStatusMap === "queued"
                            ? "Searching for a match..."
                            : "In active chat"}
                        </p>
                      </div>

                      {userStatus?.partner_id && (
                        <div>
                          <p className="font-semibold text-[#e8e9f3] mb-1">
                            Partner ID
                          </p>
                          <p className="font-mono bg-[#0f0f1e] p-2 rounded">
                            {userStatus.partner_id}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center text-[#7a7a8a] text-xs">
              <p>Built with ⚡ for Ishy</p>
            </div>
          </>
        )}
      </div>

      {/* Nickname modal */}
      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        onSubmit={handleSetNickname}
        loading={loading}
      />
    </div>
  );
}
