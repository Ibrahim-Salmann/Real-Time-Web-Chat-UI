import { useChatStore } from "../../store/chatStore";
import { getChatKey } from "../../utils/chatKey";

export default function ClientList() {
  const {
    clients,
    me,
    chats,
    activeChatKey,
    setActiveChat,
  } = useChatStore();

  return (
    <div className="space-y-1">
      {clients
        .filter((c) => c !== me)
        .map((nickname) => {
          const chatKey = getChatKey(me, nickname);

          const chat = chats[chatKey];

          const isActive =
            activeChatKey === chatKey;

          return (
            <div
              key={nickname}
              onClick={() =>
                setActiveChat(chatKey)
              }
              className={`
                flex justify-between items-center
                p-3 border-b border-[#008F11]/20 cursor-pointer
                transition
                ${
                  isActive
                    ? "bg-[#00FF41]/20 text-[#8FFF8F] border-l-2 border-l-[#00FF41]"
                    : "hover:bg-[#222222] text-[#00FF41]"
                }
              `}
            >
              {/* Left side */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold uppercase tracking-wider font-mono">
                  {nickname}
                </span>

                <span className="text-[10px] opacity-50 font-mono truncate max-w-[120px]">
                  {chat?.lastMessage ||
                    "No messages yet"}
                </span>
              </div>

              {/* Right side (badge) */}
              {chat?.unreadCount > 0 && (
                <div className="bg-[#00FF41] text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-[0_0_8px_#00FF41]">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}