import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../backend/firebase";
import { useState } from "react";
import useUserStore from "../../../../backend/userStore";

const AddUser = () => {
 const [user, setUser] = useState(null);
 const currentUser = useUserStore((state) => state.currentUser);
 const handleSearch = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  try {
   const userRef = collection(db, "users");
   const q = query(userRef, where("username", "==", username));
   const querySnapshot = await getDocs(q);

   if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    userData.id = querySnapshot.docs[0].id; // Ensure we have the user ID
    setUser(userData);
   } else {
    setUser(null);
   }
  } catch (error) {
   setUser(null);
  }
 };
 const handleAdd = async () => {
  if (!user || !currentUser) {
   console.error("User or currentUser is undefined");
   return;
  }
  const chatRef = collection(db, "chats");
  const userChatsRef = collection(db, "userchats");
  try {
   const newChatRef = doc(chatRef);
   await setDoc(newChatRef, {
    createdAt: serverTimestamp(),
    messages: [],
   });
   const chatDataForUser = {
    chatId: newChatRef.id,
    lastMessage: "",
    receiverId: currentUser.id,
    updatedAt: Date.now(),
   };

   const chatDataForCurrentUser = {
    chatId: newChatRef.id,
    lastMessage: "",
    receiverId: user.id,
    updatedAt: Date.now(),
   };

   if (!chatDataForUser.receiverId || !chatDataForCurrentUser.receiverId) {
    console.error("Receiver ID is undefined");
    return;
   }

   await updateDoc(doc(userChatsRef, user.id), {
    chats: arrayUnion(chatDataForUser),
   });

   await updateDoc(doc(userChatsRef, currentUser.id), {
    chats: arrayUnion(chatDataForCurrentUser),
   });

   //  await updateDoc(doc(userChatsRef, user.id), {
   //   chats: arrayUnion({
   //    chatId: newChatRef.id,
   //    lastMessage: "",
   //    receiverId: currentUser.id,
   //    updatedAt: Date.now(),
   //   }),
   //  });
   //  await updateDoc(doc(userChatsRef, currentUser.id), {
   //   chats: arrayUnion({
   //    chatId: newChatRef.id,
   //    lastMessage: "",
   //    receiverId: user.id,
   //    updatedAt: Date.now(),
   //   }),
   //  });
   console.log("Chat created with ID: ", newChatRef.id);
  } catch (error) {
   console.error("Error updating document: ", error);
  }
 };
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
