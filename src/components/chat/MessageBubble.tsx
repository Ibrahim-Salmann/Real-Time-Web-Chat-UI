import type { ChatMessage } from "../../types/chat";

interface Props {
  message: ChatMessage;
  isOwn?: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  return (
    <div
      className={`max-w-md px-3 py-2 rounded-lg ${
        isOwn
          ? "bg-blue-600 ml-auto"
          : "bg-zinc-800"
      }`}
    >
      <div className="text-sm font-semibold">
        {message.sender}
      </div>

      <div>{message.message}</div>
    </div>
  );
}