import { LogoutService, SessionService } from "@/services/auth.service";
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setAuth: (newToken: string) => void;
  refreshToken: () => Promise<string | null>;
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,

  setAuth: (newToken) => set({ token: newToken }),

  refreshToken: async () => {
    try {
      const response = await SessionService();
      const newToken = response.data.access_token;
      set({ token: newToken });
      return newToken;
    } catch (error) {
      console.error("Refresh token failed: ", error);
      return null;
    }
  },

  getToken: async () => {
    const { token } = get();
    if (!token) {
      return await get().refreshToken();
    }
    return token;
  },

  logout: async () => {
    await LogoutService();
    window.location.href = "/";
  },
}));
