import ClientList from "../chat/ClientList";

export default function Sidebar() {
  return (
    <div className="w-1/3 border-r border-zinc-800 h-full p-2 bg-zinc-900">
      <h2 className="font-bold mb-2">Chats</h2>
      <ClientList />
    </div>
  );
}