import type { ChatMessage } from "../../types/chat";

interface Props {
  message: ChatMessage;
  isOwn?: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  return (
    <div
      className={`max-w-md px-3 py-2 border font-mono ${
        isOwn
          ? "bg-[#00FF41]/10 border-[#00FF41] ml-auto text-[#8FFF8F]"
          : "bg-[#222222]/50 border-[#008F11] text-[#00FF41]"
      }`}
      style={{ boxShadow: isOwn ? '0 0 10px rgba(0, 255, 65, 0.3)' : 'none' }}
    >
      <div className="text-[10px] uppercase opacity-70 mb-1 tracking-widest">
        {message.sender}
      </div>
      <div className="text-sm leading-relaxed">{message.message}</div>
    </div>
  );
}