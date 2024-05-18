const ChatList = () => {
 return (
  <div className="chatlist">
   <div className="search flex items-center gap-5 p-4">
    <div className="searchbar flex-1 bg-slate-800 flex items-center gap-5 rounded-xl p-3">
     <img src="./search.png" alt="search" className="h-4 w-4" />
     <input type="text" placeholder="search" className="bg-transparent rounded-none outline-none text-white flex-1" />
    </div>
    <img src="./plus.png" alt="plus" className="h-8 w-8 bg-slate-800 p-1 cursor-pointer rounded-xl" />
   </div>
  </div>
 );
};

export default ChatList;
