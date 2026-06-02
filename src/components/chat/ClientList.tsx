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
                p-2 rounded cursor-pointer
                transition
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-zinc-800 text-zinc-300"
                }
              `}
            >
              {/* Left side */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {nickname}
                </span>

                <span className="text-xs opacity-70 truncate max-w-[150px]">
                  {chat?.lastMessage ||
                    "No messages yet"}
                </span>
              </div>

              {/* Right side (badge) */}
              {chat?.unreadCount > 0 && (
                <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}