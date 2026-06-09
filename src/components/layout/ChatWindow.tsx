import { useChatStore } from "../../store/chatStore";
import MessageBubble from "../chat/MessageBubble";

export default function ChatWindow() {
  const { chats, activeChatKey, me } = useChatStore();

  if (!activeChatKey) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono uppercase tracking-widest">
        Select a chat to begin transmission
      </div>
    );
  }

  const chat = chats[activeChatKey];
  const messages = chat?.messages || [];
  // Extract the recipient's name from the participants list
  const recipient = chat?.participants.find((p) => p !== me) || "Unknown";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/30">
      {/* Chat Header */}
      <div className="border-b border-[#008F11]/20 p-3 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]" />
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#00FF41]">
            SECURE_CONNECTION // {recipient}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === me ? "justify-end" : "justify-start"}`}>
            <MessageBubble message={m} isOwn={m.sender === me} />
          </div>
        ))}
      </div>
    </div>
  );
}
