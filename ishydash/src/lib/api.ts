const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "change-me";

interface ApiResponse<T> {
  status?: string;
  [key: string]: any;
}

async function fetchApi<T>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, any>
): Promise<T> {
  const headers: HeadersInit = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  // Queue a user
  async queue(userId: string, nickname?: string): Promise<ApiResponse<any>> {
    return fetchApi("/queue", "POST", {
      user_id: userId,
      nickname,
    });
  },

  // Leave queue or chat
  async leave(userId: string): Promise<ApiResponse<any>> {
    return fetchApi("/leave", "POST", {
      user_id: userId,
    });
  },

  // Reveal identity
  async reveal(userId: string): Promise<ApiResponse<any>> {
    return fetchApi("/reveal", "POST", {
      user_id: userId,
    });
  },

  // Block user
  async block(userId: string): Promise<ApiResponse<any>> {
    return fetchApi("/block", "POST", {
      user_id: userId,
    });
  },

  // Unblock user
  async unblock(userId: string, targetId: string): Promise<ApiResponse<any>> {
    return fetchApi("/unblock", "POST", {
      user_id: userId,
      target_id: targetId,
    });
  },

  // Set nickname
  async setNickname(userId: string, nickname: string): Promise<ApiResponse<any>> {
    return fetchApi("/nick", "POST", {
      user_id: userId,
      nickname,
    });
  },

  // Get user status
  async getMe(userId: string): Promise<ApiResponse<any>> {
    return fetchApi(`/me?user_id=${userId}`, "GET");
  },

  // Get server status
  async getStatus(): Promise<ApiResponse<any>> {
    return fetchApi("/status", "GET");
  },
};
