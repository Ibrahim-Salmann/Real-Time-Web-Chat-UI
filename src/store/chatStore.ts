import { create } from "zustand";
import type { ChatMessage } from "../types/chat";

type Chat = {
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: string;
  unreadCount: number;
  hasLoadedHistory?: boolean;
  isLoadingHistory?: boolean;
  historyError?: string;
};

type ChatState = {
  me: string;

  clients: string[];

  chats: Record<string, Chat>;

  activeChatKey: string | null;

  isConnected: boolean;
  isRefreshingClients: boolean;
  setRefreshingClients: (status: boolean) => void;
  setConnected: (status: boolean) => void;

  typingStatus: Record<string, boolean>;
  setTyping: (nickname: string, isTyping: boolean) => void;

  unreadCounts: Record<string, number>;

  incrementUnread: (nickname: string) => void;
  clearUnread: (nickname: string) => void;

  setMe: (me: string) => void;
  setClients: (clients: string[]) => void;

  setActiveChat: (chatKey: string) => void;

  ensureChat: (chatKey: string, participants: string[]) => void;

  addMessage: (chatKey: string, message: ChatMessage) => void;

  setHistory: (chatKey: string, messages: ChatMessage[]) => void;

  updateMessageStatus: (chatKey: string, timestamp: number, newStatus: ChatMessage['status']) => void;

  setHistoryError: (chatKey: string, error: string) => void;

  setLoadingHistory: (chatKey: string, isLoading: boolean) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  me: "",
  clients: [],
  chats: {},
  activeChatKey: null,
  isConnected: false,
  isRefreshingClients: false,
  typingStatus: {},
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

  setTyping: (nickname, isTyping) =>
    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [nickname]: isTyping,
      },
    })),

  setConnected: (status) => set((state) => ({ 
    isConnected: status,
    isRefreshingClients: status ? state.isRefreshingClients : false 
  })),

  setRefreshingClients: (status) => set({ isRefreshingClients: status }),

  setClients: (clients) => {
    const oldClients = get().clients;
    const disconnected = oldClients.filter((c) => !clients.includes(c));

    disconnected.forEach((nickname) => {
      if (get().chats[nickname]) {
        get().addMessage(nickname, {
          sender: "SYSTEM",
          message: "NODE_DISCONNECTED // ENCRYPTED_SESSION_TERMINATED",
          timestamp: Date.now(),
        });
      }
    });

    set({ clients, isRefreshingClients: false });
  },

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
          isLoadingHistory: false,
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
          isLoadingHistory: false,
          historyError: error,
        },
      },
    });
  },

  setLoadingHistory: (chatKey, isLoading) => {
    const chats = get().chats;
    const chat = chats[chatKey];
    if (!chat) return;

    set({
      chats: {
        ...chats,
        [chatKey]: {
          ...chat,
          isLoadingHistory: isLoading,
        },
      },
    });
  },

  updateMessageStatus: (chatKey, timestamp, newStatus) => {
    set((state) => {
      const chat = state.chats[chatKey];
      if (!chat) return state;

      const updatedMessages = chat.messages.map((msg) =>
        msg.timestamp === timestamp
          ? { ...msg, status: newStatus }
          : msg
      );

      return {
        chats: {
          ...state.chats,
          [chatKey]: {
            ...chat,
            messages: updatedMessages,
          },
        },
      };
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
    // Also, if it's an incoming message and not active, set status to 'delivered'
    if (!isActive && message.sender !== state.me && message.status !== 'read') {
      // For incoming messages, if not active, mark as delivered (or read if it was already read)
      message.status = message.status || 'delivered'; 
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