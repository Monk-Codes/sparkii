import Chat from "./components/chat/Chat";
import List from "./components/list/List";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
 return (
  <>
   <BrowserRouter>
    <Routes>
     <Route path="/" element={<List />} />
     <Route path="/chat" element={<Chat />} />
    </Routes>
   </BrowserRouter>
  </>
 );
};

export default App;
