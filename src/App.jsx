import Chat from "./components/chat/Chat";
import ChatDetail from "./components/detail/ChatDetail";
import List from "./components/list/List";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Notification from "./components/notification/Notification";
const App = () => {
 const user = false;
 return (
  <>
   <div className="container">
    {user ? (
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
