import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Client, IncomingMessage, HistoryMessage } from "../types/chat";
import { useChatStore } from "../store/chatStore";
import { getChatKey } from "../utils/chatKey";

const WS_URL =
  "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

export function useWebSocket(nickname: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const { me, addMessage, ensureChat, setClients, setHistory, incrementUnread, setConnected } = useChatStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `${WS_URL}?nickname=${nickname}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected");
      setConnected(true);
      setReconnectAttempts(0);
    };

    socket.onmessage = (event) => {
      const data: IncomingMessage = JSON.parse(event.data);

      console.log("Received:", data);

      switch (data.type) {
        case "message":
          const { sender, message } = data.payload;
          const chatKey = getChatKey(me, sender);
          ensureChat(chatKey, [me, sender]);
          addMessage(chatKey, { sender, message });

          // WhatsApp logic: increment unread if chat is not active
          const activeChatKey = useChatStore.getState().activeChatKey;
          if (activeChatKey !== chatKey) {
            incrementUnread(sender);
          }

          setMessages((prev) => [...prev, data.payload]);
          break;

        case "clients":
          const nicknames = data.payload.map((c: Client) => c.nickname);
          setClients(nicknames);
          break;

        case "messages":
          const history: HistoryMessage[] = data.payload.messages;
          if (history.length > 0) {
            // Identify the conversation partner (the one who isn't 'me')
            const first = history[0];
            const otherUser = first.sender === me ? first.recipient : first.sender;
            
            if (otherUser) {
              const chatKey = getChatKey(me, otherUser);
              ensureChat(chatKey, [me, otherUser]);
              
              const formattedMessages = history.map((m) => ({
                sender: m.sender,
                message: m.message,
              }));
              setHistory(chatKey, formattedMessages);
            }
          }
          break;

        default:
          console.log("Unknown message type");
      }
    };

    socket.onclose = () => {
      console.log("Disconnected");
      setConnected(false);

      // Exponential Backoff: 3s, 6s, 12s... (capped at 30s)
      const delay = Math.min(3000 * Math.pow(2, reconnectAttempts), 30000);
      
      reconnectTimerRef.current = setTimeout(() => {
        setReconnectAttempts((prev) => prev + 1);
      }, delay);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      socket.close();
    };
  }, [nickname, reconnectAttempts, me, setConnected]); 

  const sendMessage = (
    recipientNickname: string,
    message: string
  ) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        action: "sendMessage",
        data: {
          recipientNickname,
          recipient: recipientNickname,
          message,
        },
      })
    );
  };

  const loadMessages = (targetNickname: string) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        action: "getMessages",
        data: {
          targetNickname,
          limit: 50,
        },
      })
    );
  };

  return {
    messages,
    sendMessage,
    loadMessages,
  };
}