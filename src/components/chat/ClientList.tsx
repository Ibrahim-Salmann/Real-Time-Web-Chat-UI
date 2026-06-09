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
    <div className="flex-1 overflow-y-auto">
      {clients
        .filter((c) => c !== me)
        .map((nickname) => {
          const chatKey = getChatKey(me, nickname);
          const chat = chats[chatKey];
          const isActive = activeChatKey === chatKey;

          return (
            <div
              key={nickname}
              onClick={() => setActiveChat(chatKey)}
              className={`
                flex items-center gap-3
                p-4 border-b border-[#008F11]/10 cursor-pointer
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#00FF41]/10 text-[#8FFF8F] border-l-4 border-l-[#00FF41]"
                    : "hover:bg-[#222222] text-[#00FF41] border-l-4 border-l-transparent"
                }
              `}
            >
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 rounded-full border border-[#008F11] flex items-center justify-center flex-shrink-0 font-mono text-xs bg-[#1a1a1a]">
                {nickname.charAt(0).toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-sm font-bold uppercase tracking-wider font-mono truncate">
                    {nickname}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] opacity-50 font-mono truncate">
                    {chat?.lastMessage || "No messages yet"}
                  </span>

                  {/* Unread Badge */}
                  {chat?.unreadCount > 0 && (
                    <div className="bg-[#00FF41] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#00FF41] flex-shrink-0">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}