import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../backend/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../backend/firebase";

const ChatList = () => {
 const navigate = useNavigate();
 const [addMode, setAddMode] = useState(false);
 const [chats, setChats] = useState([]);
 const { currentUser } = useUserStore();

 useEffect(() => {
  const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
   const items = res.data().chats;
   const promises = items.map(async (item) => {
    const userDocRef = doc(db, "users", item.receiverId);
    const userDocSnap = await getDoc(userDocRef);
    const user = userDocSnap.data();
    return { ...item, user };
   });
   const chatData = await Promise.all(promises);
   setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
  });
  return () => {
   unsub();
  };
 }, [currentUser.id]);
 return (
  //container
  <div className="chatlist flex-1 flex flex-col overflow-y-scroll scroll-my-px text-center ">
   {/* search Bar */}
   <div className="search flex items-center gap-2 p-4 justify-center">
    <div className="searchbar flex-1 bg-slate-800 flex items-center gap-2 rounded-xl max-w-xs">
     <img src="./search.png" alt="search" className="h-4 w-4 ml-4" />
     <input type="text" placeholder="search" className="bg-transparent rounded-none outline-none text-white flex-1" />
    </div>
    <img src={addMode ? "./minus.png" : "./plus.png"} alt="plus" className="h-8 w-8 bg-slate-800 p-2 cursor-pointer rounded-xl" onClick={() => setAddMode((prev) => !prev)} />
   </div>
   {addMode && <AddUser />}

   {chats.map((chat) => (
    <div className="item flex items-center gap-5 p-5 cursor-pointer border-b border-b-slate-400" onClick={() => navigate("/chat")} key={chat.chatId}>
     <img src="./avatar.png" alt="profile" className="w-12 h-12 rounded-full object-cover" />
     <div className="texts flex gap-2 flex-col">
      <span className="font-medium">Kitty</span>
      <p className="text-sm font-light">{chat.lastMassage}</p>
     </div>
    </div>
   ))}
  </div>
 );
};

export default ChatList;
