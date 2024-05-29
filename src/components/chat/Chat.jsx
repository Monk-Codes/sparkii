import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../backend/firebase";
import { useChatStore } from "../../backend/chatStore";
import useUserStore from "../../backend/userStore";
import upload from "../../backend/upload";
import { formatDistanceToNow } from "date-fns";

const Chat = () => {
 const [showEmoji, setShowEmoji] = useState(false);
 const [text, setText] = useState("");
 const [chat, setChat] = useState(null);
 const [img, setImg] = useState({
  file: null,
  url: "",
 });

 const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
 const { currentUser } = useUserStore();
 const endRef = useRef(null);
 const navigate = useNavigate();

 const convertFirestoreTimestampToDate = (timestamp) => {
  if (timestamp && timestamp.seconds) {
   return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
   return null;
  }
 };
 const formatDistanceToNowCustom = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
   return `${seconds} seconds`;
  }

  return formatDistanceToNow(date);
 };
 useEffect(() => {
  if (!chatId) {
   console.error("chatId is null or undefined");
   return;
  }

  const chatDocRef = doc(db, "chats", chatId);

  const unSub = onSnapshot(
   chatDocRef,
   (res) => {
    if (!res.exists()) {
     console.error("No chat document found for chatId:", chatId);
     setChat(null);
     return;
    }

    const chatData = res.data();
    if (chatData && chatData.messages) {
     chatData.messages.forEach((message) => {
      const parsedDate = convertFirestoreTimestampToDate(message.createdAt);
      if (isNaN(parsedDate.getTime())) {
       console.error("Invalid date:", message.createdAt);
      }
     });
    }
    setChat(chatData);
   },
   (error) => {
    console.error("Error fetching chat data:", error);
   }
  );

  return () => {
   unSub();
  };
 }, [chatId]);

 useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [chat]);

 const handleEmoji = (e) => {
  setText((prev) => prev + e.emoji);
  setShowEmoji(false);
 };

 const handleImg = (e) => {
  if (e.target.files[0]) {
   setImg({
    file: e.target.files[0],
    url: URL.createObjectURL(e.target.files[0]),
   });
  }
 };

 const handleSend = async () => {
  if (text === "") return;
  let imgUrl = null;
  try {
   if (img.file) {
    imgUrl = await upload(img.file);
   }
   await updateDoc(doc(db, "chats", chatId), {
    messages: arrayUnion({
     senderId: currentUser.id,
     text,
     createdAt: new Date(),
     ...(imgUrl && { img: imgUrl }),
    }),
   });

   const userIDs = [currentUser.id, user.id];
   for (const id of userIDs) {
    const userChatsRef = doc(db, "userchats", id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    if (userChatsSnapshot.exists()) {
     const userChatsData = userChatsSnapshot.data();
     const chatIndex = userChatsData.chats.findIndex((item) => item.chatId === chatId);
     if (chatIndex !== -1) {
      userChatsData.chats[chatIndex].lastMessage = text;
      userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
      userChatsData.chats[chatIndex].updatedAt = new Date().toISOString();
      await updateDoc(userChatsRef, { chats: userChatsData.chats });
     } else {
      console.error("Chat ID not found in userChatsData for user:", id);
     }
    } else {
     console.error("User chat document does not exist for user ID:", id);
    }
   }
  } catch (error) {
   console.error("Error sending message:", error);
  }
  setImg({
   file: null,
   url: "",
  });
  setText("");
 };

 return (
  <div className="chatContainer">
   <div className="flex justify-between h-full">
    <div className="chat flex flex-1 justify-between flex-col border-y border-y-slate-400">
     <div className="top p-5 flex items-center justify-between border-b border-b-slate-400">
      <img src="./angle-left.svg" alt="back" onClick={() => navigate(-1)} className="cursor-pointer" />
      <div className="user flex items-center gap-1">
       <img src={user?.avatar || "./avatar.png"} alt="profile" className="w-14 h-14 rounded-full object-cover cursor-pointer" onClick={() => navigate("/detail")} />
       <div className="texts flex gap-1 flex-col">
        <span className="text-lg font-bold">{user?.username}</span>
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
      {chat?.messages?.map((message) => {
       const createdAtDate = convertFirestoreTimestampToDate(message.createdAt);

       return (
        <div className={`message max-w-48 flex gap-1 flex-col ${message.senderId === currentUser.id ? "self-end" : "self-start"}`} key={message?.createdAt}>
         <div className="texts">
          {message.img && <img src={message.img} alt="image" />}
          <p className={`${message.senderId === currentUser.id ? "bg-slate-600" : "bg-slate-400"} rounded-md p-1`}>{message.text}</p>
          <span>{isNaN(createdAtDate.getTime()) ? "Invalid date" : formatDistanceToNowCustom(createdAtDate)}</span>
         </div>
        </div>
       );
      })}
      {img.url && (
       <div className="message">
        <div className="texts">
         <img src={img.url} alt="img" />
        </div>
       </div>
      )}
      <div ref={endRef}></div>
     </div>

     <div className="bottom p-1 gap-1 flex items-center justify-between border-t-slate-400 border-t mb-auto">
      <div className="icons gap-1 flex">
       <label htmlFor="file">
        <img src="./img.png" alt="img" className="w-5 h-5 cursor-pointer" />
       </label>
       <input type="file" id="file" className="hidden" onChange={handleImg} />
       <img src="./camera.png" alt="camera" className="w-5 h-5 cursor-pointer" />
       <img src="./mic.png" alt="mic" className="w-5 h-5 cursor-pointer" />
      </div>
      <div className="emoji relative">
       <img src="./emoji.png" alt="emoji" className="w-5 h-5" onClick={() => setShowEmoji((prev) => !prev)} />
       <div className="picker">
        <EmojiPicker open={showEmoji} onEmojiClick={handleEmoji} className="max-w-90 max-h-80 rounded shadow-md z-40" />
       </div>
      </div>
      <input
       type="text"
       name="msg"
       id="msg"
       placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message..."}
       className="flex-1 bg-slate-700 border-none outline-none text-white p-2 rounded-3xl text-sm disabled:cursor-not-allowed"
       disabled={isCurrentUserBlocked || isReceiverBlocked}
       value={text}
       onChange={(e) => setText(e.target.value)}
      />
      <button className="sendBtn bg-green-700 text-white py-2 px-4 rounded-3xl cursor-pointer disabled:cursor-not-allowed" disabled={isCurrentUserBlocked || isReceiverBlocked} onClick={handleSend}>
       Send
      </button>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Chat;
