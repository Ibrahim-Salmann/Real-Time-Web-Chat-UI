import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Client, IncomingMessage } from "../types/chat";
import { useChatStore } from "../store/chatStore";
import { getChatKey } from "../utils/chatKey";

const WS_URL =
  "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

export function useWebSocket(nickname: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const { me, addMessage, ensureChat, setClients } = useChatStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = new WebSocket(
      `${WS_URL}?nickname=${nickname}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected");
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
          setMessages((prev) => [...prev, data.payload]);
          break;

        case "clients":
          const nicknames = data.payload.map((c: Client) => c.nickname);
          setClients(nicknames);
          break;

        case "messages":
          console.log(
            "HISTORY:",
            data.payload.messages
          );
          break;

        default:
          console.log("Unknown message type");
      }
    };

    socket.onclose = () => {
      console.log("Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [nickname]); 
  // Note: If using React 18 with automatic batching,  might not need to memoize `sendMessage`
  // However, if  encounter issues, consider using `useCallback` for `sendMessage`
  // remove me, addMessage, ensureChat, setClients from dependencies if they are stable (e.g., from Zustand store)

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