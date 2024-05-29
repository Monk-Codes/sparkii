import Chat from "./components/chat/Chat";
import ChatDetail from "./components/detail/ChatDetail";
import List from "./components/list/List";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./backend/firebase";
import useUserStore from "./backend/userStore";
import { useChatStore } from "./backend/chatStore";

const App = () => {
 const { currentUser, isLoading, fetchUserInfo } = useUserStore();
 const { chatId } = useChatStore();

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
   fetchUserInfo(user?.uid);
  });
  return () => {
   unsub();
  };
 }, [fetchUserInfo]);

 if (isLoading) return <div className="p-5 text-sm rounded-md bg-slate-600">Loading...</div>;

 return (
  <BrowserRouter>
   <div className="container">
    <Routes>
     {currentUser ? (
      <>
       <Route path="/" element={<List />} />
       {chatId && <Route path="/chat" element={<Chat />} />}
       {chatId && <Route path="/detail" element={<ChatDetail />} />}
      </>
     ) : (
      <Route path="/login" element={<LoginPage />} />
     )}
    </Routes>
    <Notification />
   </div>
  </BrowserRouter>
 );
};

export default App;
