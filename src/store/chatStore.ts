import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

type Chat = {
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: string;
  unreadCount: number;
  hasLoadedHistory?: boolean;
};

type ChatState = {
  me: string;

  clients: string[];

  chats: Record<string, Chat>;

  activeChatKey: string | null;

  isConnected: boolean;
  setConnected: (status: boolean) => void;

  unreadCounts: Record<string, number>;

  incrementUnread: (nickname: string) => void;
  clearUnread: (nickname: string) => void;

  setMe: (me: string) => void;
  setClients: (clients: string[]) => void;

  setActiveChat: (chatKey: string) => void;

  ensureChat: (chatKey: string, participants: string[]) => void;

  addMessage: (chatKey: string, message: ChatMessage) => void;

  setHistory: (chatKey: string, messages: ChatMessage[]) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  me: "",
  clients: [],
  chats: {},
  activeChatKey: null,
  isConnected: false,
  unreadCounts: {},

  incrementUnread: (nickname) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [nickname]: (state.unreadCounts[nickname] || 0) + 1,
      },
    })),

  clearUnread: (nickname) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [nickname]: 0,
      },
    })),

  setMe: (me) => set({ me }),

  setConnected: (status) => set({ isConnected: status }),

  setClients: (clients) => set({ clients }),

  setActiveChat: (chatKey) => {
    set({ activeChatKey: chatKey });
  },

  ensureChat: (chatKey, participants) => {
    const chats = get().chats;

    if (!chats[chatKey]) {
      set({
        chats: {
          ...chats, // Preserve existing chats
          [chatKey]: {
            participants,
            messages: [],
            unreadCount: 0,
            hasLoadedHistory: false,
          },
        },
      });
    }
  },

  setHistory: (chatKey, messages) => {
    const chats = get().chats;
    const chat = chats[chatKey];
    if (!chat) return;

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          messages: messages, // Overwrite with full history or merge logic
          hasLoadedHistory: true,
          lastMessage: messages.length > 0 ? messages[messages.length - 1].message : chat.lastMessage,
        },
      },
    });
  },

  addMessage: (chatKey, message) => {
    const chats = get().chats;

    const chat = chats[chatKey];

    if (!chat) return;

    const isActive = get().activeChatKey === chatKey;

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.message,
          unreadCount: 0, // Legacy field reset, now using unreadCounts record
        },
      },
    });
  },
}));