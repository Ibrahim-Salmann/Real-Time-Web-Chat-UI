import { useState } from "react";
import ClientList from "../chat/ClientList";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";

type Props = {
  onRefresh?: () => void;
};

export default function Sidebar({ onRefresh }: Props) {
  const { isConnected, me, setMe, isRefreshingClients, clients } = useChatStore();
  const clearNickname = useAuthStore((state) => state.clearNickname);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleLogout = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    clearNickname();
    setMe("");
  };

  return (
    <div className="w-1/3 border-r border-[#008F11]/20 h-full flex flex-col bg-black">
      {/* System Status Header */}
      <div className="p-4 border-b border-[#008F11]/20 bg-zinc-950">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            System // ID
          </h1>
          <div className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
            isConnected ? "text-[#00FF41] border-[#00FF41]/30" : "text-red-500 border-red-500/30"
          }`}>
            {isConnected ? "ACTIVE" : "OFFLINE"}
          </div>
        </div>
        <div className="text-[#00FF41] font-mono text-sm truncate">
          &gt; {me || "UNIDENTIFIED_USER"}
        </div>
      </div>

      <div className="p-4 border-b border-[#008F11]/20 flex items-center justify-between">
        <h2 className="text-[#00FF41] font-mono font-bold uppercase tracking-[0.3em] text-xs">
          Network // Nodes
          <span className={`ml-2 font-normal tracking-normal lowercase transition-colors ${
            isConnected ? "text-zinc-500 opacity-50" : "text-red-500 animate-pulse"
          }`}>
            [{clients.length}]
          </span>
        </h2>
        <button
          onClick={onRefresh}
          disabled={isRefreshingClients || !isConnected}
          className={`text-[9px] font-mono transition-colors border px-1.5 py-0.5 rounded flex items-center gap-1 ${
            isRefreshingClients
              ? "text-yellow-500 border-yellow-500/30 cursor-wait"
              : "text-zinc-500 hover:text-[#00FF41] border-zinc-800 hover:border-[#00FF41]/30"
          }`}
        >
          {isRefreshingClients && <span className="animate-spin inline-block">/</span>}
          {isRefreshingClients ? "SYNCING..." : "RE-SYNC"}
        </button>
      </div>
      <ClientList />

      {/* Session Termination Footer */}
      <div className="p-4 border-t border-[#008F11]/20 bg-zinc-950/50 mt-auto">
        {isConfirming ? (
          <div className="flex flex-col gap-2">
            <div className="text-yellow-500 font-mono text-[9px] uppercase animate-pulse mb-1 text-center">
              !! CONFIRM_TERMINATION !!
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-900/20 border border-red-500/50 text-red-500 font-mono text-[9px] py-1.5 hover:bg-red-500 hover:text-black transition-all"
              >
                PROCEED
              </button>
              <button
                onClick={() => setIsConfirming(false)}
                className="flex-1 bg-zinc-900/50 border border-zinc-500/30 text-zinc-500 font-mono text-[9px] py-1.5 hover:text-white transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-500 hover:text-red-400 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors group"
          >
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">&gt;</span> [ TERMINATE_SESSION ]
          </button>
        )}
      </div>
    </div>
  );
}