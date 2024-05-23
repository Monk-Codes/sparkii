import Chat from "./components/chat/Chat";
import ChatDetail from "./components/detail/ChatDetail";
import List from "./components/list/List";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
 return (
  <>
   <BrowserRouter>
    <Routes>
     <Route path="/" element={<List />} />
     <Route path="/chat" element={<Chat />} />
     <Route path="/detail" element={<ChatDetail />} />
    </Routes>
   </BrowserRouter>
  </>
 );
};

export default App;
