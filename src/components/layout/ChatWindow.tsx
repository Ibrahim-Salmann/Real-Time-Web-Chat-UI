import { useChatStore } from "../../store/chatStore";

export default function ChatWindow() {
  const { activeChat, chats, me } = useChatStore();

  if (!activeChat) {
    return <div className="flex-1 flex items-center justify-center">
      Select a chat
    </div>;
  }

  const chat = chats[activeChat];

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {chat?.messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              msg.sender === me ? "justify-end" : "justify-start"
            }`}
          >
            <div className="bg-blue-500 text-white px-3 py-1 rounded">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
