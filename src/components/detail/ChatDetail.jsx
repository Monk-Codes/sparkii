import { useNavigate } from "react-router-dom";
import { auth, db } from "../../backend/firebase";
import { useChatStore } from "../../backend/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import useUserStore from "../../backend/userStore";

const ChatDetail = () => {
 const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } = useChatStore();
 const { currentUser } = useUserStore();
 const navigate = useNavigate();
 // Handle Block
 const handleBlock = async () => {
  if (!user) return;
  const userDocRef = doc(db, "users", currentUser.id);
  try {
   await updateDoc(userDocRef, {
    blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
   });
   changeBlock();
  } catch (error) {
   console.log(error);
  }
 };
 // Handle Logout
 const handleLogout = () => {
  auth.signOut();
  resetChat();
 };
 return (
  <div className="chatContainer">
   <div className="flex h-full">
    <div className="overflow-y-scroll scroll-my-px scroll-smooth snap-proximity flex flex-1 flex-col border-y-slate-400 border-y">
     <div className="detail flex flex-col p-1 ">
      <div className="user flex  gap-1 p-1 w-full justify-between">
       <img src="./angle-left.svg" alt="back" onClick={() => navigate(-1)} className="cursor-pointer " />
       <div className="justify-between flex items-center gap-3 p-3">
        <img src={user?.avatar || "./avatar.png"} alt="profile" className="w-14 h-14 rounded-full object-cover" />
        <div className="texts flex gap-1 flex-col">
         <span className="text-lg font-bold">{user?.username}</span>
        </div>
       </div>
       <div></div>
      </div>
      <div className="info flex items-center flex-col p-12 gap-4">
       {/* CHAT SETTINGS */}
       <div className="option w-full">
        <div className="title flex items-center justify-between">
         <span>Chat Settings</span>
         <img src="./arrowUp.png" alt="setting" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
        </div>
       </div>
       {/* Setting end */}

       {/* CHAT SETTINGS */}
       <div className="option w-full flex flex-col  text-center justify-center">
        <div className="title flex items-center justify-between">
         <span>Shared photos</span>
         <img src="./arrowDown.png" alt="setting" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
        </div>
        <div className="photos flex flex-col gap-3 p-5 mb-6 items-center">
         <div className="photoDetail h-36 w-36 flex flex-col items-end text-center">
          <img src={"https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="image" />
          <div className="photoInfo flex p-2 gap-2">
           <span>photo_24_07</span>
           <img src="./download.png" alt="download" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
          </div>
         </div>
         <div className="photoDetail h-36 w-36 flex flex-col items-end text-center">
          <img src="./avatar.png" alt="image" />
          <div className="photoInfo flex gap-2 p-2">
           <span>photo_21_07</span>
           <img src="./download.png" alt="download" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
          </div>
         </div>
        </div>
       </div>
       {/* Setting end */}
       {/* CHAT SETTINGS */}
       <div className="option w-full">
        <div className="title flex items-center justify-between">
         <span>Privacy & Help</span>
         <img src="./arrowUp.png" alt="setting" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
        </div>
       </div>
       {/* Setting end */}
       {/* CHAT SETTINGS */}
       <div className="option w-full">
        <div className="title flex items-center justify-between">
         <span>Chat Settings</span>
         <img src="./arrowUp.png" alt="setting" className="w-8 h-8 bg-slate-800 p-2 rounded-full cursor-pointer" />
        </div>
       </div>
       {/* Setting end */}
       <button className=" bg-red-400 hover:bg-red-500 max-w-48 items-center cursor-pointer rounded-full p-2" onClick={handleBlock}>
        {isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User blocked" : "Block User"}{" "}
       </button>
       <button className=" bg-red-400 hover:bg-red-500 max-w-48 items-center cursor-pointer rounded-full p-2" onClick={handleLogout}>
        Logout
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default ChatDetail;
