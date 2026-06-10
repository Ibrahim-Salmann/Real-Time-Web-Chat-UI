import type { ChatMessage } from "../../types/chat";

type Props = {
  message: ChatMessage;
  isOwn: boolean;
};

export default function MessageBubble({ message, isOwn }: Props) {
  if (message.sender === "SYSTEM") {
    return (
      <div className="py-1 px-3 border border-red-500/30 bg-red-500/5 text-red-500 text-[9px] font-mono uppercase tracking-widest rounded">
        {message.message}
      </div>
    );
  }

  const statusIndicator = () => {
    if (!isOwn || !message.status) return null;
    let colorClass = "text-zinc-500";
    if (message.status === 'delivered') colorClass = "text-[#00FF41]"; // Green for delivered
    if (message.status === 'read') colorClass = "text-blue-400"; // Blue for read

    return (
      <span className={`text-[8px] font-mono ml-2 ${colorClass}`}>
        [{message.status.toUpperCase()}]
      </span>
    );
  };

  return (
    <div className={`max-w-[70%] p-3 rounded-lg ${isOwn ? "bg-[#008F11]/30" : "bg-zinc-800"}`}>
      <p className="text-sm font-mono text-white break-words">{message.message}</p>
      {statusIndicator()}
    </div>
  );
}