import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

type Chat = {
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: string;
  unreadCount: number;
  hasLoadedHistory?: boolean;
  historyError?: string;
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

  setHistoryError: (chatKey: string, error: string) => void;
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
    get().clearUnread(chatKey);
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
    const chat = chats[chatKey] || {
      participants: [get().me, chatKey],
      messages: [],
      unreadCount: 0,
      hasLoadedHistory: false,
    };

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          messages: [...messages].sort((a, b) => a.timestamp - b.timestamp),
          hasLoadedHistory: true,
          historyError: undefined,
          lastMessage: messages.length > 0 ? messages[messages.length - 1].message : chat.lastMessage,
        },
      },
    });
  },

  setHistoryError: (chatKey, error) => {
    const chats = get().chats;
    const chat = chats[chatKey];
    if (!chat) return;

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          historyError: error,
        },
      },
    });
  },

  addMessage: (chatKey, message) => {
    const state = get();
    const chats = state.chats;
    const chat = chats[chatKey] || {
      participants: [state.me, chatKey],
      messages: [],
      unreadCount: 0,
      hasLoadedHistory: false,
    };

    const isActive = state.activeChatKey === chatKey;
    
    // Logic: If the chat isn't active, increment the unread counter
    if (!isActive && message.sender !== state.me) {
      state.incrementUnread(chatKey);
    }

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          messages: [...chat.messages, message].sort((a, b) => a.timestamp - b.timestamp),
          lastMessage: message.message,
          unreadCount: 0, // Legacy field reset, now using unreadCounts record
        },
      },
    });
  },
}));