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

  setAuth: (newToken) => {
    document.cookie = "isLoggedIn=true; path=/; SameSite=Lax";
    set({ token: newToken });
  },

  refreshToken: async () => {
    try {
      const response = await SessionService();
      const newToken = response.data.access_token;
      document.cookie = "isLoggedIn=true; path=/; SameSite=Lax";
      set({ token: newToken });
      return newToken;
    } catch (error) {
      console.error("Refresh token failed: ", error);
      document.cookie = "isLoggedIn=false; path=/; SameSite=Lax";
      window.location.href = "/";
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
    document.cookie = "isLoggedIn=false; path=/; SameSite=Lax";
    window.location.href = "/";
  },
}));
