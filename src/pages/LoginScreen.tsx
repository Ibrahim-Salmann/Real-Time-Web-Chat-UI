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
    <div className="h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-6 rounded-xl w-80 space-y-4"
      >
        <h1 className="text-white text-xl font-semibold">
          Enter your nickname
        </h1>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Ibrahim"
          className="w-full p-2 rounded bg-zinc-700 text-white outline-none"
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
          type="submit"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}