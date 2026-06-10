import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";

export default function MessageInput({ 
  onSend, 
  onTyping 
}: { 
  onSend: (msg: string) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { activeChatKey } = useChatStore();

  // Cleanup typing timeout on unmount or when switching chats
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // If the chat changes, reset the local typing state
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
  }, [activeChatKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);

    if (!isTyping && newValue.trim().length > 0) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

  const handleSend = () => {
    if (!activeChatKey || !text.trim()) return;

    onSend(text);
    setText("");

    // Clear typing status immediately upon transmission
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    onTyping(false);
  };

  return (
    <div className="p-4 bg-black border-t border-[#008F11]/30 flex gap-4 items-center">
      <span className="text-[#00FF41] font-mono font-bold">{">"}</span>
      <div className="flex-1 relative">
        <input
          className="w-full bg-transparent border-b border-[#008F11]/50 p-2 text-[#00FF41] font-mono outline-none focus:border-[#00FF41] transition-colors placeholder:text-[#008F11]/30"
          value={text}
          onChange={handleInputChange}
          placeholder="Input data packet..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
      </div>
      <button
        onClick={handleSend}
        className="bg-[#008F11] hover:bg-[#00FF41] text-black font-mono font-bold px-6 py-2 transition-all shadow-[0_0_10px_rgba(0,143,17,0.3)] hover:shadow-[0_0_15px_#00FF41] uppercase text-xs tracking-widest"
      >
        Transmit
      </button>
    </div>
  );
}