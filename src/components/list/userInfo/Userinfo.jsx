const Userinfo = () => {
 return (
  <div className="userInfo p-5 flex items-center justify-between">
   <div className="user flex items-center gap-5">
    <img src="./avatar.png" alt="profile" className="w-12 h-12 rounded-full object-cover" />
    <h2>Pratik</h2>
   </div>
   <div className="icons flex gap-5 cursor-pointer">
    <img src="./more.png" alt="more" className="w-5 h-5 " />
    <img src="./video.png" alt="videocall" className="w-5 h-5 " />
    <img src="./edit.png" alt="edit" className="w-5 h-5 " />
   </div>
  </div>
 );
};

export default Userinfo;
