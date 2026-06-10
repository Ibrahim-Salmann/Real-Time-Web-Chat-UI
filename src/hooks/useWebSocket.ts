import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

const WS_URL = "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

export function useWebSocket(nickname: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const { setConnected, addMessage, setClients, setHistory, setRefreshingClients, setTyping, updateMessageStatus } = useChatStore();

  const connect = useCallback(() => {
    if (!nickname) return;

    const socket = new WebSocket(`${WS_URL}?nickname=${nickname}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ CONNECTED_TO_TERMINAL");
      setConnected(true);
      reconnectAttempts.current = 0;
      // Auto-request clients on connection
      console.log("📤 AUTO_REQUESTING_CLIENTS on connection");
      socket.send(JSON.stringify({ action: "listClients" }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 MESSAGE_RECEIVED:", data.type, data);

        switch (data.type) {
          case "clients_list":
            console.log("✅ CLIENTS_LIST:", data.payload.clients);
            setClients(data.payload.clients);
            break;
          case "new_message":
            console.log("💬 NEW_MESSAGE from", data.payload.sender);
            addMessage(data.payload.sender, data.payload);
            break;
          case "history_result":
            console.log("📜 HISTORY_LOADED:", data.payload.messages.length, "messages");
            setHistory(data.payload.chatKey, data.payload.messages);
            break;
          case "user_typing":
            console.log("✍️ TYPING_STATUS:", data.payload.sender, data.payload.isTyping);
            setTyping(data.payload.sender, data.payload.isTyping);
            break;
          case "message_status_update":
            console.log("🔄 STATUS_UPDATE:", data.payload.status);
            updateMessageStatus(data.payload.chatKey, data.payload.timestamp, data.payload.status);
            break;
          default:
            console.warn("⚠️ UNKNOWN_MESSAGE_TYPE:", data.type, data);
        }
      } catch (err) {
        console.error("❌ MESSAGE_PARSE_ERROR:", err, "Raw data:", event.data);
      }
    };

    socket.onclose = () => {
      console.warn("⛔ CONNECTION_LOST");
      setConnected(false);
      const timeout = Math.min(30000, Math.pow(2, reconnectAttempts.current) * 1000);
      console.warn(`🔄 RECONNECTING_IN_${timeout}ms (Attempt ${reconnectAttempts.current + 1})`);

      setTimeout(() => {
        reconnectAttempts.current++;
        connect();
      }, timeout);
    };

    socket.onerror = (err) => {
      console.error("❌ WEBSOCKET_ERROR:", err);
      socket.close();
    };
  }, [nickname, setConnected, addMessage, setClients, setHistory, setTyping, updateMessageStatus]);

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
        timestamp: Date.now(),
        status: 'sent'
      };
      console.log("📤 SENDING_MESSAGE to", recipient, payload);
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.error("❌ TRANSMISSION_FAILED: Socket state:", socketRef.current?.readyState, "(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)");
    }
  }, [nickname, addMessage]);

  const getHistory = useCallback((chatKey: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("📤 REQUESTING_HISTORY for", chatKey);
      socketRef.current.send(JSON.stringify({ action: "getHistory", chatKey }));
    } else {
      console.error("❌ HISTORY_REQUEST_FAILED: Socket not OPEN");
    }
  }, []);

  const refreshClients = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("📤 REQUESTING_CLIENTS_LIST");
      setRefreshingClients(true);
      socketRef.current.send(JSON.stringify({ action: "listClients" }));
    } else {
      console.error("❌ CLIENTS_REQUEST_FAILED: Socket not OPEN");
    }
  }, [setRefreshingClients]);

  const sendTyping = useCallback((recipient: string, isTyping: boolean) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        action: "typing",
        recipient,
        isTyping
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { sendMessage, getHistory, refreshClients, sendTyping };
}
