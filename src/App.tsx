import { useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./pages/LoginScreen";
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";

export default function App() {
  const nickname = useAuthStore((state) => state.nickname);
  const setMe = useChatStore((state) => state.setMe);

  // Sync the auth nickname with the chat store identity
  useEffect(() => {
    if (nickname) {
      setMe(nickname);
    }
  }, [nickname, setMe]);

  if (!nickname) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return <ChatPage />;
}
