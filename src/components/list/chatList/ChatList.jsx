import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
 const navigate = useNavigate();
 const [addMode, setAddMode] = useState(false);
 return (
  //container
  <div className="chatlist flex-1 overflow-scroll">
   {/* search Bar */}
   <div className="search flex items-center gap-5 p-4">
    <div className="searchbar flex-1 bg-slate-800 flex items-center gap-5 rounded-xl p-2">
     <img src="./search.png" alt="search" className="h-4 w-4" />
     <input type="text" placeholder="search" className="bg-transparent rounded-none outline-none text-white flex-1" />
    </div>
    <img src={addMode ? "./minus.png" : "./plus.png"} alt="plus" className="h-8 w-8 bg-slate-800 p-2 cursor-pointer rounded-xl" onClick={() => setAddMode((prev) => !prev)} />
   </div>
   {/* CARD */}
   <div className="item flex items-center gap-5 p-5 cursor-pointer border-b border-b-slate-400" onClick={() => navigate("/chat")}>
    <img src="./avatar.png" alt="profile" className="w-12 h-12 rounded-full object-cover" />
    <div className="texts flex gap-2 flex-col">
     <span className="font-medium">Pratik</span>
     <p className="text-sm font-light">Hello</p>
    </div>
   </div>
  </div>
 );
};

export default ChatList;
