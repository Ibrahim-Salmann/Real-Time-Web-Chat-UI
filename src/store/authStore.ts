import { create } from "zustand";

type AuthState = {
  nickname: string;
  setNickname: (name: string) => boolean;
  clearNickname: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  nickname: localStorage.getItem("nickname") || "",

  setNickname: (name) => {
    const sanitized = name.trim();
    if (sanitized.toUpperCase() === "SYSTEM") {
      return false;
    }
    localStorage.setItem("nickname", sanitized);
    set({ nickname: sanitized });
    return true;
  },

  clearNickname: () => {
    localStorage.removeItem("nickname");
    set({ nickname: "" });
  },
}));