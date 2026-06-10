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
    if (!isOwn) return null;

    let icon = "◌"; // pending
    let colorClass = "text-zinc-500";

    if (message.status === 'delivered') {
      icon = "✓";
      colorClass = "text-[#00FF41]";
    } else if (message.status === 'read') {
      icon = "✓✓";
      colorClass = "text-blue-400";
    }

    return (
      <span className={`text-[9px] font-mono ml-2 ${colorClass} opacity-70 hover:opacity-100 transition-opacity`}>
        {icon}
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