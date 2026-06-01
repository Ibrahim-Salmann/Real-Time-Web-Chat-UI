import { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./components/LoginScreen";
import { useChatStore } from "./store/chatStore";

export default function App() {
  const [nickname, setNickname] = useState<string | null>(null);
  const setMe = useChatStore((state) => state.setMe);

  useEffect(() => {
    if (nickname) {
      setMe(nickname);
    }
  }, [nickname, setMe]);

  if (!nickname) {
    return (
      <LoginScreen onJoin={setNickname} />
    );
  }

  return <ChatPage />;
}