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

  setMe: (me) => set({ me }),

  setClients: (clients) => set({ clients }),

  setActiveChat: (chatKey) => {
    const chats = get().chats;

    if (chats[chatKey]) {
      chats[chatKey].unreadCount = 0;
    }

    set({ activeChatKey: chatKey, chats });
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
          unreadCount: isActive
          ? 0 // If the chat is active, reset unread count
          : chat.unreadCount + 1,
        },
      },
    });
  },
}));