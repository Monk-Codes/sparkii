import Chat from "./components/chat/Chat";
import ChatDetail from "./components/detail/ChatDetail";
import List from "./components/list/List";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./backend/firebase";
import useUserStore from "./backend/userStore";
import { useChatStore } from "./backend/chatStore";
import MyDetail from "./components/myDetail/MyDetail";

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
       <Route path="/list" element={<List />} />
       <Route path="/mydetail" element={<MyDetail />} />
       {chatId && <Route path="/chat" element={<Chat />} />}
       {chatId && <Route path="/detail" element={<ChatDetail />} />}
       {/* Redirect to /list if no other routes match */}
       <Route path="*" element={<Navigate to="/list" />} />
      </>
     ) : (
      <>
       <Route path="/" element={<LoginPage />} />
       {/* Redirect to / if no other routes match */}
       <Route path="*" element={<Navigate to="/" />} />
      </>
     )}
    </Routes>
   </div>
   <Notification />
  </BrowserRouter>
 );
};

export default App;
