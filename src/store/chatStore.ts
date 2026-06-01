import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

type Chat = {
  participants: string[];
  messages: ChatMessage[];
};

type ChatState = {
  me: string;

  clients: string[];

  chats: Record<string, Chat>;

  activeChatKey: string | null;

  setMe: (me: string) => void;
  setClients: (clients: string[]) => void;

  setActiveChat: (chatKey: string) => void;

  ensureChat: (chatKey: string, participants: string[]) => void;

  addMessage: (chatKey: string, message: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  me: "",
  clients: [],
  chats: {},
  activeChatKey: null,

  setMe: (me) => set({ me }),

  setClients: (clients) => set({ clients }),

  setActiveChat: (chatKey) =>
    set({ activeChatKey: chatKey }),

  ensureChat: (chatKey, participants) => {
    const chats = get().chats;

    if (!chats[chatKey]) {
      set({
        chats: {
          ...chats,
          [chatKey]: {
            participants,
            messages: [],
          },
        },
      });
    }
  },

  addMessage: (chatKey, message) => {
    const chats = get().chats;

    const chat = chats[chatKey];

    if (!chat) return;

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          messages: [...chat.messages, message],
        },
      },
    });
  },
}));