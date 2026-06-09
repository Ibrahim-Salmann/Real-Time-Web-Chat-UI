import { useState } from "react";
import { useAuthStore } from "../store/authStore";

type Props = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: Props) {
  const [input, setInput] = useState("");
  const setNickname = useAuthStore((s) => s.setNickname);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setNickname(input.trim());
    onLogin();
  };

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

        <div className="space-y-1">
          <label className="text-[10px] text-[#008F11] uppercase tracking-widest">Identify User</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
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