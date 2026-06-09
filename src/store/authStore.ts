import { create } from "zustand";

type AuthState = {
  nickname: string;
  setNickname: (name: string) => void;
  clearNickname: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  nickname: localStorage.getItem("nickname") || "",

  setNickname: (name) => {
    localStorage.setItem("nickname", name);
    set({ nickname: name });
  },

  clearNickname: () => {
    localStorage.removeItem("nickname");
    set({ nickname: "" });
  },
}));