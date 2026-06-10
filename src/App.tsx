import { useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./pages/LoginScreen";
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";

export default function App() {
  const nickname = useAuthStore((state) => state.nickname);
  const setMe = useChatStore((state) => state.setMe);
  const me = useChatStore((state) => state.me);

  useEffect(() => {
    if (nickname && me !== nickname) {
      setMe(nickname);
    }
  }, [nickname, me, setMe]);

  if (!nickname) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return <ChatPage />;
}
