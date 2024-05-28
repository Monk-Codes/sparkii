import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../backend/firebase";
import { useChatStore } from "../../backend/chatStore";
import useUserStore from "../../backend/userStore";

const Chat = () => {
 const [showEmoji, setShowEmoji] = useState(false);
 const [text, setText] = useState("");
 const [chat, setChat] = useState();

 const { chatId, user } = useChatStore();
 const { currentUser } = useUserStore();
 const endRef = useRef(null);
 const navigate = useNavigate();

 // Handle EMOJI
 const handleEmoji = (e) => {
  setText((prev) => prev + e.emoji);
  setShowEmoji(false);
 };

 //unsub
 useEffect(() => {
  const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
   setChat(res.data());
  });
  return () => {
   unSub();
  };
 }, [chatId]);
 // TOP VIEW
 useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
 });

 //Handle send
 const handleSend = async () => {
  if (text === "") return;
  try {
   await updateDoc(doc(db, "chats", chatId), {
    messages: arrayUnion({
     senderId: currentUser.id,
     text,
     createdAt: new Date(),
    }),
   });
   const userIDs = [currentUser.id, user.id];
   userIDs.forEach(async (id) => {
    const userChatsRef = doc(db, "userchats", id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    if (userChatsSnapshot.exists()) {
     const userChatsData = userChatsSnapshot.data();
     const chatIndex = userChatsData.chats.findIndex((item) => item.chatId === chatId);
     userChatsData.chats[chatIndex].lastMessage = text;
     userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
     userChatsData.chats[chatIndex].updatedAt = Date.now();
     await updateDoc(userChatsRef, { chats: userChatsData.chats });
    }
   });
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <>
   <div className="chatContainer">
    <div className=" flex justify-between h-full ">
     <div className="chat flex flex-1 justify-between flex-col border-y border-y-slate-400 ">
      <div className="top p-5 flex items-center justify-between border-b border-b-slate-400">
       <img src="./angle-left.svg" alt="back" onClick={() => navigate(-1)} className="cursor-pointer" />
       <div className="user flex items-center gap-1">
        <img src="./avatar.png" alt="profile" className="w-14 h-14 rounded-full object-cover cursor-pointer" onClick={() => navigate("/detail")} />
        <div className="texts flex gap-1 flex-col">
         <span className="text-lg font-bold">Kitty</span>
         <p className="text-sm font-light text-gray-400">message</p>
        </div>
       </div>
       <div className="icons flex gap-3">
        <img src="./phone.png" alt="phone" className="w-5 h-5" />
        <img src="./video.png" alt="phone" className="w-5 h-5" />
        <img src="./info.png" alt="phone" className="w-5 h-5" />
       </div>
      </div>

      <div className="center p-5 flex-1 overflow-y-scroll scroll-my-px scroll-smooth snap-proximity snap-y snap-end flex flex-col gap-3">
       {/* message card */}
       {chat?.messages?.map((message) => (
        <div className="message max-w-48 flex gap-1 flex-col self-start" key={message?.createdAt}>
         <div className="texts ">
          {message.img && <img src={message.img} alt="image" />}
          <p className="bg-slate-900 rounded-md p-1">{message.text}</p>
          <span>1 min ago</span>
         </div>
        </div>
       ))}

       <div className="messageMy max-w-48 flex gap-1 flex-col self-end">
        <div className="texts">
         <p className="bg-green-900 rounded-md p-1">messages reply</p>
         <span>1 min ago</span>
        </div>
       </div>
       {/* card end */}
       <div ref={endRef}></div>
      </div>

      <div className="bottom p-1 gap-1 flex items-center justify-between border-t-slate-400 border-t mb-auto">
       <div className="icons gap-1 flex ">
        <img src="./img.png" alt="img" className="w-5 h-5 cursor-pointer" />
        <img src="./camera.png" alt="camera" className="w-5 h-5 cursor-pointer" />
        <img src="./mic.png" alt="mic" className="w-5 h-5 cursor-pointer" />
       </div>
       <div className="emoji relative">
        <img src="./emoji.png" alt="emoji" className="w-5 h-5" onClick={() => setShowEmoji((prev) => !prev)} />
        <div className="picker">
         <EmojiPicker open={showEmoji} onEmojiClick={handleEmoji} className="max-w-90 max-h-80 rounded shadow-md z-40" />
        </div>
       </div>
       <input type="text" name="msg" id="msg" placeholder="Type a message..." className="flex-1 bg-slate-700 border-none outline-none text-white p-2 rounded-3xl text-sm" value={text} onChange={(e) => setText(e.target.value)} />

       <button className="sendBtn bg-green-700 text-white py-2 px-4 rounded-3xl cursor-pointer" onClick={handleSend}>
        Send
       </button>
      </div>
     </div>
    </div>
   </div>
  </>
 );
};

export default Chat;
