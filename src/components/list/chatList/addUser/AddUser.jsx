import { arrayUnion, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../backend/firebase";
import { useState } from "react";
import useUserStore from "../../../../backend/userStore";
import { toast } from "react-toastify";
const AddUser = () => {
 const [user, setUser] = useState(null);
 const [isDialogVisible, setDialogVisible] = useState(true);
 const currentUser = useUserStore((state) => state.currentUser);

 const handleSearch = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputUsername = formData.get("username").toLowerCase();

  if (inputUsername.length < 2) {
   console.log("Input username is less than 2 characters");
   setUser(null);
   return;
  }

  try {
   const userRef = collection(db, "users");
   const querySnapshot = await getDocs(userRef);

   const matchingUsers = [];
   querySnapshot.forEach((doc) => {
    const userData = doc.data();
    console.log("Checking user:", userData.username);
    if (userData.username.toLowerCase().includes(inputUsername)) {
     userData.id = doc.id;
     matchingUsers.push(userData);
    }
   });

   if (matchingUsers.length > 0) {
    console.log("Found matching user:", matchingUsers[0]);
    setUser(matchingUsers[0]);
   } else {
    toast.error("No matching users found");
    setUser(null);
   }
  } catch (error) {
   toast.error("Error searching for user:", error);
   setUser(null);
  }
 };

 const handleAdd = async () => {
  if (!user || !currentUser) {
   toast.error("User or currentUser is undefined");
   return;
  }

  try {
   const userChatsRef = doc(db, "userchats", currentUser.id);
   const userChatsDoc = await getDoc(userChatsRef);

   if (userChatsDoc.exists()) {
    const userChatsData = userChatsDoc.data();
    const isAlreadyAdded = userChatsData.chats.some((chat) => chat.receiverId === user.id);

    if (isAlreadyAdded) {
     toast.error("User already added");
     setDialogVisible(false);
     return;
    }
   }

   const chatRef = collection(db, "chats");
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

   await updateDoc(doc(collection(db, "userchats"), user.id), {
    chats: arrayUnion(chatDataForUser),
   });

   await updateDoc(doc(collection(db, "userchats"), currentUser.id), {
    chats: arrayUnion(chatDataForCurrentUser),
   });

   toast.success("Chat successfully added");
   setDialogVisible(false);
  } catch (error) {
   console.error("Error updating document:", error);
   toast.error("Error updating document");
  }
 };

 return (
  isDialogVisible && (
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
  )
 );
};

export default AddUser;
