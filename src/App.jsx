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
const App = () => {
 const { currentUser, isLoading, fetchUserInfo } = useUserStore();

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
   fetchUserInfo(user?.uid);
  });
  return () => {
   unsub();
  };
 }, [fetchUserInfo]);

 if (isLoading) return <div className="p-5 texst-sm rounded-md bg-slate-600">Loading...</div>;
 return (
  <>
   <div className="container">
    {currentUser ? (
     <BrowserRouter>
      <Routes>
       <>
        <Route path="/" element={<List />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/detail" element={<ChatDetail />} />
       </>
      </Routes>
     </BrowserRouter>
    ) : (
     <LoginPage />
    )}
    <Notification />
   </div>
  </>
 );
};

export default App;
