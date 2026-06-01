import { useChatStore } from "../../store/chatStore";
import { getChatKey } from "../../utils/chatKey";

export default function ClientList() {
  const {
    clients,
    me,
    activeChatKey,
    setActiveChat,
  } = useChatStore();

  return (
    <div className="space-y-2">
      {clients
        .filter((c) => c !== me)
        .map((nickname) => {
          const chatKey = getChatKey(me, nickname);

          const isActive =
            activeChatKey === chatKey;

          return (
            <div
              key={nickname}
              onClick={() =>
                setActiveChat(chatKey)
              }
              className={`
                text-sm cursor-pointer p-2 rounded
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }
              `}
            >
              {nickname}
            </div>
          );
        })}
    </div>
  );
}