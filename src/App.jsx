import Chat from "./components/chat/Chat";
import ChatDetail from "./components/detail/ChatDetail";
import List from "./components/list/List";

const App = () => {
 return (
  <div className="container">
   <List />
   <Chat />
   <ChatDetail />
  </div>
 );
};

export default App;
