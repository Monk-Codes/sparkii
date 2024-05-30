import { useNavigate } from "react-router-dom";
import useUserStore from "../../backend/userStore";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../backend/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatStore } from "../../backend/chatStore";

const MyDetail = () => {
 const { currentUser, setCurrentUser } = useUserStore();
 const { resetChat } = useChatStore();
 const navigate = useNavigate();

 const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
   const storage = getStorage();
   const storageRef = ref(storage, `avatars/${currentUser.id}`);
   await uploadBytes(storageRef, file);
   const downloadURL = await getDownloadURL(storageRef);

   const userDocRef = doc(db, "users", currentUser.id);
   await updateDoc(userDocRef, { avatar: downloadURL });

   setCurrentUser({ ...currentUser, avatar: downloadURL });
  } catch (error) {
   console.error("Error updating avatar:", error);
   toast.error("Failed to update avatar.");
  }
  window.location.reload();
  toast.success("Avatar updated successfully!");
 };

 const handleDeleteAccount = async () => {
  try {
   const userDocRef = doc(db, "users", currentUser.id);
   await deleteDoc(userDocRef);

   // Additional steps like logging out the user can be added here
   navigate("/");
   toast.success("Account deleted successfully!");
  } catch (error) {
   console.error("Error deleting account:", error);
   toast.error("Failed to delete account.");
  }
 };
 // Handle Logout
 const handleLogout = () => {
  auth.signOut();
  resetChat();
 };

 return (
  <div className="flex-1 flex flex-col overflow-y-scroll text-center p-5 bg-gray-900">
   <div className="flex items-center mb-5">
    <img src="./angle-left.svg" alt="back" onClick={() => navigate(-1)} className="cursor-pointer h-6 w-6 hover:scale-110 transition-transform" />
    <h2 className="px-4 text-lg font-semibold">My Details</h2>
   </div>
   <div className="flex flex-col items-center gap-4">
    <div className="relative">
     <img src={currentUser.avatar || "./avatar.png"} alt="profile" className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
     <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
    <h2 className="text-xl font-medium">{currentUser.username}</h2>
    <div>
     <label htmlFor="email">
      Email:
      <p className="text-sm ml-2 email"> {currentUser.email}</p>
     </label>
    </div>
    <button className="bg-red-400 hover:bg-red-500 max-w-48 items-center cursor-pointer rounded-full p-2" onClick={handleLogout}>
     Logout
    </button>
    <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
     Delete Account
    </button>
   </div>
  </div>
 );
};

export default MyDetail;
