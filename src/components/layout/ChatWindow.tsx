import { useChatStore } from "../../store/chatStore";
import MessageBubble from "../chat/MessageBubble";
import { useEffect, useRef } from "react";

export default function ChatWindow() {
  const { chats, activeChatKey, me, isConnected } = useChatStore();

  const chat = activeChatKey ? chats[activeChatKey] : null;
  const messages = chat?.messages || [];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!activeChatKey) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono uppercase tracking-widest">
        Select a chat to begin transmission
      </div>
    );
  }

  // Extract the recipient's name from the participants list
  const recipient = chat?.participants.find((p) => p !== me) || "Unknown";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/30">
      {!isConnected && (
        <div className="bg-yellow-500 text-black text-center p-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
          !! CONNECTION_LOST // ATTEMPTING_RECONNECTION !!
        </div>
      )}

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
        {messages.length > 0 ? (
          <>
            {messages.map((m, i) => (
              <div key={`${m.timestamp}-${i}`} className={`flex flex-col ${m.sender === me ? "items-end" : "items-start"}`}>
                <div className="text-[8px] font-mono text-zinc-500 mb-1 opacity-50 px-2">
                  [{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </div>
                <MessageBubble message={m} isOwn={m.sender === me} />
              </div>
            ))}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em]">No previous logs found</div>
            <div className="text-[8px] font-mono">Channel is clear for transmission...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
