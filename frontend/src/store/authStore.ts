import { LogoutService, SessionService } from "@/services/auth.service";
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setAuth: (newToken: string) => void;
  refreshToken: () => Promise<string>;
  getToken: () => Promise<string>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,

  setAuth: (newToken) => set({ token: newToken }),
  refreshToken: async () => {
    const response = await SessionService();
    set({ token: response.data.access_token });
    return response.data.access_token;
  },

  getToken: async () => {
    const token = get().token;
    if (!token) {
      return await get().refreshToken();
    }
    return token;
  },

  logout: async () => {
    await LogoutService();
    set({ token: null });
  },
}));
