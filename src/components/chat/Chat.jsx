import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

const Chat = () => {
 const [showEmoji, setShowEmoji] = useState(false);
 const [text, setText] = useState("");
 const handleEmoji = (e)=>{
  setText((prev)=>prev+e.emoji)
  setShowEmoji(false)
 };
 return (
  <>
   <div className="chatContainer">
    <div className=" flex">
     <div className="chat flex-1 border-y border-y-slate-400 ">
      <div className="top p-5 flex items-center justify-between border-b border-b-slate-400">
       <div className="user flex items-center gap-1">
        <img src="./avatar.png" alt="profile" className="w-14 h-14 rounded-full object-cover" />
        <div className="texts flex gap-1 flex-col">
         <span className="text-lg font-bold">Chat k andar</span>
         <p className="text-sm font-light text-gray-400">message</p>
        </div>
       </div>
       <div className="icons flex gap-3">
        <img src="./phone.png" alt="phone" className="w-5 h-5" />
        <img src="./video.png" alt="phone" className="w-5 h-5" />
        <img src="./info.png" alt="phone" className="w-5 h-5" />
       </div>
      </div>
      <div className="center"></div>
      <div className="bottom p-1 gap-1 flex items-center justify-between border-t-slate-400 border-t">
       <div className="icons gap-1 flex ">
        <div className="emoji">
         <img src="./emoji.png" alt="emoji" className="w-5 h-5" onClick={() => setShowEmoji((prev) => !prev)} />
         <EmojiPicker open={showEmoji} onEmojiClick={handleEmoji} className="max-w-90 max-h-80 bg-white rounded shadow-md z-40" />
        </div>
        <img src="./img.png" alt="img" className="w-5 h-5 cursor-pointer" />
        <img src="./camera.png" alt="camera" className="w-5 h-5 cursor-pointer" />
        <img src="./mic.png" alt="mic" className="w-5 h-5 cursor-pointer" />
       </div>
      </div>
      <input type="text" name="msg" id="msg" placeholder="Type a message..." className="flex-1 bg-slate-700 border-none outline-none text-white p-2 rounded-3xl text-sm"value={text} onChange={(e)=>setText(e.target.value)}/>

      <button className="sendBtn bg-green-700 text-white py-2 px-4 rounded-3xl cursor-pointer">Send</button>
     </div>
    </div>
   </div>
  </>
 );
};

export default Chat;
