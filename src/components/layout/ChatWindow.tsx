import { useChatStore } from "../../store/chatStore";

export default function ChatWindow() {
  const { chats, activeChatKey } = useChatStore();

  const chat = activeChatKey ? chats[activeChatKey] : null;

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {chat.messages.map((msg, i) => (
        <div
          key={i}
          className={`mb-2 ${
            msg.sender === chat.participants[0]
              ? "text-left"
              : "text-right"
          }`}
        >
          <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded">
            {msg.message}
          </span>
        </div>
      ))}
    </div>
  );
}
