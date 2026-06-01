import { useState } from "react";
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const [nickname, setNickname] = useState<string | null>(null);

  if (!nickname) {
    return (
      <LoginScreen
        onJoin={setNickname}
      />
    );
  }

  return <ChatPage />;
}