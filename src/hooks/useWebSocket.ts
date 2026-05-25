import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Client, IncomingMessage } from "../types/chat";

const WS_URL =
  "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

export function useWebSocket(nickname: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

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
          setMessages((prev) => [...prev, data.payload]);
          break;

        case "clients":
          setClients(data.payload);
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
          message,
        },
      })
    );
  };

  return {
    messages,
    clients,
    sendMessage,
  };
}