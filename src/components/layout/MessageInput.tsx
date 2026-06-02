import { useState } from "react";
import { useChatStore } from "../../store/chatStore";

export default function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState("");
  const { activeChatKey } = useChatStore();

  const handleSend = () => {
    if (!activeChatKey || !text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="p-2 border-t flex">
      <input
        className="flex-1 border p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-green-500 text-white px-4"
      >
        Send
      </button>
    </div>
  );
}