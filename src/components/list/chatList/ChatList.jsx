import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../backend/userStore";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import { useChatStore } from "../../../backend/chatStore";

const ChatList = () => {
 const [addMode, setAddMode] = useState(false);
 const [chats, setChats] = useState([]);
 const [input, setInput] = useState("");
 const { currentUser } = useUserStore();
 const { chatId, changeChat } = useChatStore();
 const navigate = useNavigate();
 console.log(chatId);

 useEffect(() => {
  if (!currentUser || !currentUser.id) {
   console.error("Current user is not set or does not have an ID");
   return;
  }

  const userChatsDocRef = doc(db, "userchats", currentUser.id);

  const createChatDocumentIfNotExists = async () => {
   const userChatsDocSnap = await getDoc(userChatsDocRef);
   if (!userChatsDocSnap.exists()) {
    console.log("Creating chat document for current user");
    await setDoc(userChatsDocRef, { chats: [] });
   }
  };

  createChatDocumentIfNotExists();

  const unsub = onSnapshot(userChatsDocRef, async (res) => {
   if (!res.exists()) {
    console.error("No chat document found for current user");
    setChats([]);
    return;
   }

   const data = res.data();
   if (!data || !data.chats) {
    console.error("Chat data is not in the expected format");
    setChats([]);
    return;
   }

   const items = data.chats;
   const promises = items.map(async (item) => {
    try {
     if (!item.receiverId) {
      console.error("Chat item does not have a receiverId:", item);
      return null;
     }

     const userDocRef = doc(db, "users", item.receiverId);
     const userDocSnap = await getDoc(userDocRef);
     if (!userDocSnap.exists()) {
      console.error("User document does not exist for receiverId:", item.receiverId);
      return null;
     }

     const user = userDocSnap.data();
     return { ...item, user };
    } catch (error) {
     console.error("Error fetching user data for chat item:", item, error);
     return null;
    }
   });

   const chatData = (await Promise.all(promises)).filter((item) => item !== null);
   setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
  });

  return () => {
   unsub();
  };
 }, [currentUser]);

 // Handle Select
 const handleSelect = async (chat) => {
  const userChats = chats.map((item) => {
   const { ...rest } = item;
   return rest;
  });
  const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
  userChats[chatIndex].isSeen = true;
  const userChatsRef = doc(db, "userchats", currentUser.id);
  try {
   await updateDoc(userChatsRef, {
    chats: userChats,
   });
   changeChat(chat.chatId, chat.user);
   navigate("/chat");
  } catch (error) {
   console.log(error);
  }
 };

 // Filter chat
 const filteredChats = chats.filter((e) => e.user.username.toLowerCase().includes(input.toLowerCase()));

 return (
  <div className="chatlist flex-1 flex flex-col overflow-y-scroll scroll-my-px text-center">
   <div className="search flex items-center gap-2 p-4 justify-center">
    <div className="searchbar flex-1 bg-slate-800 flex items-center gap-2 rounded-xl max-w-xs">
     <img src="./search.png" alt="search" className="h-4 w-4 ml-4" />
     <input type="text" placeholder="search" className="bg-transparent rounded-none outline-none text-white flex-1" onChange={(e) => setInput(e.target.value)} />
    </div>
    <img src={addMode ? "./minus.png" : "./plus.png"} alt="plus" className="h-8 w-8 bg-slate-800 p-2 cursor-pointer rounded-xl" onClick={() => setAddMode((prev) => !prev)} />
   </div>

   {addMode && <AddUser />}

   {filteredChats.map((chat) => (
    <div className="item flex items-center gap-5 p-5 cursor-pointer border-b border-b-slate-400" onClick={() => handleSelect(chat)} key={chat.chatId} style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183ee" }}>
     <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="profile" className="w-12 h-12 rounded-full object-cover" />
     <div className="texts flex gap-2 flex-col">
      <span className="font-medium">{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
      <p className="text-sm font-light">{chat.lastMessage}</p>
     </div>
    </div>
   ))}
  </div>
 );
};

export default ChatList;
