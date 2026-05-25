import { create } from "zustand";

export type Message = {
  sender: string;
  message: string;
};

type Chat = {
  chatKey: string;
  participants: string[];
  messages: Message[];
};

type ChatState = {
  me: string;
  activeChat: string | null;
  clients: string[];

  chats: Record<string, Chat>;

  setMe: (name: string) => void;
  setClients: (clients: string[]) => void;

  setActiveChat: (chatKey: string) => void;

  addMessage: (chatKey: string, message: Message) => void;
  ensureChat: (chatKey: string, participants: string[]) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  me: "",
  activeChat: null,
  clients: [],
  chats: {},

  setMe: (me) => set({ me }),

  setClients: (clients) => set({ clients }),

  setActiveChat: (chatKey) => set({ activeChat: chatKey }),

  ensureChat: (chatKey, participants) =>
    set((state) => {
      if (state.chats[chatKey]) return state;

      return {
        chats: {
          ...state.chats,
          [chatKey]: {
            chatKey,
            participants,
            messages: [],
          },
        },
      };
    }),

  addMessage: (chatKey, message) =>
    set((state) => {
      const chat = state.chats[chatKey];

      if (!chat) return state;

      return {
        chats: {
          ...state.chats,
          [chatKey]: {
            ...chat,
            messages: [...chat.messages, message],
          },
        },
      };
    }),
}));