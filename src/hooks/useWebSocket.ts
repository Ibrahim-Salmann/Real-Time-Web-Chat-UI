import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

const WS_URL = "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

export function useWebSocket(nickname: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const { setConnected, addMessage, setClients, setHistory } = useChatStore();

  const connect = useCallback(() => {
    if (!nickname) return;

    const socket = new WebSocket(`${WS_URL}?nickname=${nickname}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("CONNECTED_TO_TERMINAL");
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "clients_list":
          setClients(data.payload.clients);
          break;
        case "new_message":
          addMessage(data.payload.sender, data.payload);
          break;
        case "history_result":
          setHistory(data.payload.chatKey, data.payload.messages);
          break;
      }
    };

    socket.onclose = () => {
      setConnected(false);
      const timeout = Math.min(30000, Math.pow(2, reconnectAttempts.current) * 1000);
      console.warn(`CONNECTION_LOST. RECONNECTING_IN_${timeout}ms`);

      setTimeout(() => {
        reconnectAttempts.current++;
        connect();
      }, timeout);
    };

    socket.onerror = (err) => {
      console.error("TERMINAL_ERROR:", err);
      socket.close();
    };
  }, [nickname, setConnected, setClients, addMessage, setHistory]);

  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);

  const sendMessage = useCallback((recipient: string, message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        action: "sendMessage",
        recipient,
        message,
        timestamp: Date.now()
      };
      socketRef.current.send(JSON.stringify(payload));
      addMessage(recipient, { sender: nickname, message, timestamp: Date.now() });
    }
  }, [nickname, addMessage]);

  const getHistory = useCallback((chatKey: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: "getHistory", chatKey }));
    }
  }, []);

  return { sendMessage, getHistory };
}
