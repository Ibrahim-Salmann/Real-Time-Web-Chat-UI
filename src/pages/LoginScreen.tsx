import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

type Props = {
  onLogin: () => void;
};

const BOOT_MESSAGES = [
  "LOADER_V4.2.0 // INITIALIZING_KERNEL...",
  "MOUNTING_ENCRYPTED_DATA_VOLUMES...",
  "ESTABLISHING_SECURE_TUNNEL_PROTOCOL...",
  "CALIBRATING_QUANTUM_HANDSHAKE...",
  "NODE_SYNC_COMPLETE. ACCESS_AUTHORIZED."
];

export default function LoginScreen({ onLogin }: Props) {
  const [input, setInput] = useState("");
  const [bootIndex, setBootIndex] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setNickname = useAuthStore((s) => s.setNickname);

  // System Boot sequence logic
  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const delay = Math.random() * 600 + 300;
      const timeout = setTimeout(() => setBootIndex(prev => prev + 1), delay);
      return () => clearTimeout(timeout);
    } else {
      const finalize = setTimeout(() => setIsBooting(false), 1000);
      return () => clearTimeout(finalize);
    }
  }, [bootIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const success = setNickname(input.trim());
    if (success) {
      onLogin();
    } else {
      setError("IDENTIFIER_RESERVED: PLEASE_CHOOSE_ANOTHER_NODE_NAME.");
    }
  };

  if (isBooting) {
    return (
      <div className="h-screen flex items-center justify-center bg-black font-mono p-8">
        <div className="w-full max-w-md space-y-2">
          {BOOT_MESSAGES.slice(0, bootIndex).map((msg, i) => (
            <div key={i} className="text-[#00FF41] text-[10px] uppercase tracking-widest">
              <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> &gt; {msg}
            </div>
          ))}
          {bootIndex < BOOT_MESSAGES.length && (
            <div className="text-[#00FF41] text-[10px] animate-pulse">
              &gt; EXECUTING_SYSTEM_TASKS...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black font-mono">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 border border-[#008F11]/30 shadow-[0_0_20px_rgba(0,143,17,0.1)] w-96 space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-[#00FF41] text-xl font-bold tracking-[0.2em] uppercase">
            Access Terminal
          </h1>
          <div className="h-0.5 w-12 bg-[#00FF41]" />
        </div>

        {error && (
          <div className="border border-red-500/50 bg-red-950/20 p-3 text-red-500 font-mono text-[10px] animate-pulse">
            &gt; ERROR: {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-[#008F11] uppercase tracking-widest">Identify User</label>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter nickname..."
            className="w-full p-3 bg-black border border-[#008F11]/50 text-[#00FF41] outline-none focus:border-[#00FF41] transition-colors placeholder:text-[#008F11]/30"
            autoFocus
          />
        </div>

        <button
          className="w-full bg-[#008F11] hover:bg-[#00FF41] text-black font-bold p-3 transition-all duration-200 uppercase tracking-widest shadow-[0_0_10px_rgba(0,143,17,0.3)] hover:shadow-[0_0_15px_#00FF41]"
          type="submit"
        >
          Initialize Connection
        </button>
      </form>
    </div>
  );
}