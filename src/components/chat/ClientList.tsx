import { useState } from "react";
import { useChatStore } from "../../store/chatStore";

export default function ClientList() {
  const { clients, chats, me, activeChatKey, setActiveChat, unreadCounts } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Get all unique user nicknames from both online clients and chat history
  const allUserNames = Array.from(new Set([...clients, ...Object.keys(chats)]));

  // 2. Filter by search query, exclude 'me', and sort: Online users first, then alphabetically
  const filteredUsers = allUserNames.filter((name) => {
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return name !== me && matchesSearch;
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    const aOnline = clients.includes(a);
    const bOnline = clients.includes(b);

    if (aOnline && !bOnline) return -1; // a comes first
    if (!aOnline && bOnline) return 1;  // b comes first
    return a.localeCompare(b);          // both same status, alphabetize
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search Input */}
      <div className="p-4 border-b border-[#008F11]/20">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#008F11]/50 text-xs font-mono">/</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-black border border-[#008F11]/30 rounded p-1.5 pl-5 text-[#00FF41] font-mono text-xs outline-none focus:border-[#00FF41]/50 placeholder:text-[#008F11]/30"
          />
        </div>
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sortedUsers.map((username) => {
          const isOnline = clients.includes(username);
          const isActive = activeChatKey === username;
          const unreadCount = unreadCounts[username] || 0;

          return (
            <button
              key={username}
              onClick={() => setActiveChat(username)}
              className={`w-full flex items-center justify-between p-4 border-b border-[#008F11]/10 transition-colors ${
                isActive ? "bg-[#008F11]/20" : "hover:bg-[#008F11]/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline
                      ? "bg-[#00FF41] shadow-[0_0_5px_#00FF41] animate-pulse"
                      : "bg-zinc-700"
                  }`}
                />
                <span className={`font-mono text-sm ${isOnline ? "text-white" : "text-zinc-500"}`}>
                  {username}
                </span>
              </div>

              {unreadCount > 0 && (
                <div className="bg-[#00FF41] text-black text-[9px] font-bold px-1.5 rounded min-w-[18px] text-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}