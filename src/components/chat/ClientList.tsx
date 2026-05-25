import type { Client } from "../../types/chat";

interface Props {
  clients: Client[];
}

export default function ClientList({ clients }: Props) {
  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div
          key={c.nickname}
          className="text-sm text-zinc-300"
        >
          {c.nickname}
        </div>
      ))}
    </div>
  );
}