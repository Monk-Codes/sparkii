const AddUser = () => {
 return (
  <div className="addUser p-3 bg-gray-600 opacity-90 rounded-3xl absolute top-0 bottom-0 left-0 right-0 m-auto w-max h-max">
   <form className="flex gap-3 p-2">
    <input type="text" placeholder="userName" name="username" />
    <button>Search</button>
   </form>
   <div className="user flex text-center justify-between">
    <div className="detail flex p-3 gap-2 text-center items-center">
     <img src="./avatar.png" alt="profile" className="w-12 h-12 rounded-full object-cover" />
     <span className="">New Username</span>
    </div>
    <button className="text-white rounded-3xl px-3 h-1/3 mt-5 font-semibold border bg-gray-400 cursor-pointer">Add User</button>
   </div>
  </div>
 );
};

export default AddUser;
