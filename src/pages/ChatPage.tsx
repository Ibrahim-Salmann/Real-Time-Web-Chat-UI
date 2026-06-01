import { useWebSocket } from "../hooks/useWebSocket";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/layout/ChatWindow";
import MessageInput from "../components/layout/MessageInput";
import { useChatStore } from "../store/chatStore";

export default function ChatPage() {
  const { me, activeChatKey } = useChatStore();
  const { sendMessage } = useWebSocket(me);

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