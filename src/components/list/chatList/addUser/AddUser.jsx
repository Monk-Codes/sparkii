import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../backend/firebase";
import { useState } from "react";

const AddUser = () => {
 const [user, setUser] = useState(null);

 const handleSearch = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  try {
   const userRef = collection(db, "users");
   const q = query(userRef, where("username", "==", username));
   const querySnapshot = await getDocs(q);
   if (!querySnapshot.empty) {
    setUser(querySnapshot.docs[0].data());
   }
  } catch (error) {
   console.log(error);
  }
 };
 const handleAdd = async () => {};
 return (
  <div className="addUser p-3 bg-gray-600 opacity-90 rounded-3xl absolute top-0 bottom-0 left-0 right-0 m-auto w-max h-max">
   <form className="flex gap-3 p-2" onSubmit={handleSearch}>
    <input type="text" placeholder="userName" name="username" />
    <button>Search</button>
   </form>
   {user && (
    <div className="user flex text-center justify-between">
     <div className="detail flex p-3 gap-2 text-center items-center">
      <img src={user.avatar || "./avatar.png"} alt="profile" className="w-12 h-12 rounded-full object-cover" />
      <span className="">{user.username}</span>
     </div>
     <button className="text-white rounded-3xl px-3 h-1/3 mt-5 font-semibold border bg-gray-400 cursor-pointer" onClick={handleAdd}>
      Add User
     </button>
    </div>
   )}
  </div>
 );
};

export default AddUser;
