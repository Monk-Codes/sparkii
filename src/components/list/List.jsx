import Userinfo from "./userInfo/Userinfo.jsx";
import ChatList from "./chatList/ChatList.jsx";
const List = () => {
 return (
  <>
   <div className="container">
    <div className="flex-1 flex flex-col">
     <Userinfo />
     <ChatList />
    </div>
   </div>
  </>
 );
};

export default List;
