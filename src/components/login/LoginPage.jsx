import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../backend/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../backend/upload";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
 const navigate = useNavigate();
 const [avatar, setAvatar] = useState({
  file: null,
  url: "",
 });

 const handleAvatar = (e) => {
  if (e.target.files[0]) {
   setAvatar({
    file: e.target.files[0],
    url: URL.createObjectURL(e.target.files[0]),
   });
  }
 };

 const handleLogin = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { email, password } = Object.fromEntries(formData.entries());
  try {
   await signInWithEmailAndPassword(auth, email, password);
   toast.success("Login successful");
  } catch (error) {
   console.error("Login error:", error);
   toast.error("Please login with correct credentials");
  }
  navigate("/list");
 };

 const handleRegister = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { username, password, email } = Object.fromEntries(formData.entries());

  if (!username || !email || !password) return toast.warn("Please enter all inputs!");
  if (!avatar.file) return toast.warn("Please upload an avatar!");

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
   return toast.warn("Username already exists. Please select another username.");
  }

  try {
   const res = await createUserWithEmailAndPassword(auth, email, password);
   console.log("User created with UID:", res.user.uid);
   const imgUrl = await upload(avatar.file);
   await setDoc(doc(db, "users", res.user.uid), {
    username,
    email,
    avatar: imgUrl,
    id: res.user.uid,
    blocked: [],
   });
   await setDoc(doc(db, "userchats", res.user.uid), {
    chats: [],
   });
   toast.success("Account created successfully");
   toast.success("You can Login now");
  } catch (error) {
   console.error("Registration error:", error);
   toast.error(error.message);
  }
  navigate("/list");
 };

 return (
  <div className="login w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 p-10">
   <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full">
    <div className="item flex-1 flex flex-col items-center gap-2 mb-8">
     <h2 className="text-white text-xl font-bold">Welcome Back</h2>
     <form className="flex flex-col items-center justify-center gap-2 w-full" onSubmit={handleLogin}>
      <input type="email" placeholder="Email" name="email" required className="p-3 w-full bg-gray-800 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
      <input type="password" placeholder="Password" name="password" required minLength={6} className="p-3 w-full bg-gray-800 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
      <button className="p-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Log In</button>
     </form>
    </div>

    <div className="separator w-full border-t border-gray-800 my-4"></div>

    <div className="item flex-1 flex flex-col items-center gap-2">
     <h2 className="text-white text-xl font-bold">Create an Account</h2>
     <form className="flex flex-col items-center justify-center gap-2 w-full" onSubmit={handleRegister}>
      <label htmlFor="file" className="flex flex-col items-center cursor-pointer">
       <img src={avatar.url || "./avatar.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-gray-800 hover:opacity-80 transition" />
       <span className="text-white mt-1">Upload an Image</span>
      </label>
      <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
      <input type="text" placeholder="Username" name="username" required minLength={6} className="p-3 w-full bg-gray-800 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
      <input type="email" placeholder="Email" name="email" required className="p-3 w-full bg-gray-800 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
      <input type="password" placeholder="Password" name="password" required minLength={6} className="p-3 w-full bg-gray-800 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
      <button className="p-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Sign Up</button>
     </form>
    </div>
   </div>
  </div>
 );
};

export default LoginPage;
