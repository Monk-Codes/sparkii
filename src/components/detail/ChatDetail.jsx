import { useNavigate } from "react-router-dom";
import { auth } from "../../backend/firebase";

const ChatDetail = () => {
 const navigate = useNavigate();
 return (
  <div className="chatContainer">
   <div className="flex h-full">
    <div className="overflow-y-scroll scroll-my-px scroll-smooth snap-proximity flex flex-1 flex-col border-y-slate-400 border-y">
     <div className="detail flex flex-col p-1 ">
      <div className="user flex  gap-1 p-1 w-full justify-between">
       <img src="./angle-left.svg" alt="back" onClick={() => navigate(-1)} className="cursor-pointer " />
       <div className="justify-between flex items-center gap-3 p-3">
        <img src="./avatar.png" alt="profile" className="w-14 h-14 rounded-full object-cover" />
        <div className="texts flex gap-1 flex-col">
         <span className="text-lg font-bold">Kitty</span>
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
          <img src={"https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="image" />
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
       <button className=" bg-red-400 hover:bg-red-500 max-w-48 items-center cursor-pointer rounded-full p-2">Block User</button>
       <button className=" bg-red-400 hover:bg-red-500 max-w-48 items-center cursor-pointer rounded-full p-2" onClick={() => auth.signOut()}>
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
