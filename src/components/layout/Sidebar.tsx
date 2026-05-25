import { useChatStore } from "../../store/chatStore";

export default function Sidebar() {
  const { clients, me, setActiveChat, activeChat } = useChatStore();

  const openChat = (client: string) => {
    setActiveChat(client);
  };

  return (
    <div className="w-1/3 border-r border-zinc-800 h-full p-2 bg-zinc-900">
      <h2 className="font-bold mb-2">Chats</h2>

      {clients
        .filter((c) => c !== me)
        .map((client) => (
          <div
            key={client}
            onClick={() => openChat(client)}
            className={`p-2 cursor-pointer rounded mb-1 transition-colors ${
              activeChat === client ? "bg-zinc-800" : "hover:bg-zinc-800"
            }`}
          >
            {client}
          </div>
        ))}
    </div>
  );
}