import { useWebSocket } from "../hooks/useWebSocket";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";
import MessageInput from "../components/layout/MessageInput";
import { useChatStore } from "../store/chatStore";
import { useEffect } from "react";

export default function ChatPage() {
  const { me, activeChatKey, chats, isConnected } = useChatStore();
  const { sendMessage, getHistory } = useWebSocket(me);

  // Automatically trigger history fetch when a new chat is selected
  useEffect(() => {
    if (activeChatKey && isConnected) {
      const chat = chats[activeChatKey];
      if (!chat || !chat.hasLoadedHistory) {
        getHistory(activeChatKey);
      }
    }
  }, [activeChatKey, isConnected, chats, getHistory]);

  return (
    <div className="h-screen bg-zinc-900 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <ChatWindow />

        <MessageInput
          onSend={(msg) => {
            if (activeChatKey) sendMessage(activeChatKey, msg);
          }}
        />
      </div>
    </div>
  );
}