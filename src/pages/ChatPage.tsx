import { useWebSocket } from "../hooks/useWebSocket";

export default function ChatPage() {
  const { clients, messages } = useWebSocket("ibrahim");

  return (
    <div className="h-screen bg-zinc-900 text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-zinc-800 p-4">
        <h2 className="text-xl font-bold mb-4">
          Online Clients
        </h2>

        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.nickname}
              className="bg-zinc-800 p-2 rounded"
            >
              {client.nickname}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-3 rounded"
            >
              <div className="font-bold">
                {msg.sender}
              </div>

              <div>{msg.message}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          Input coming next...
        </div>
      </div>
    </div>
  );
}