/* eslint-disable no-undef */
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../backend/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../backend/upload";

const LoginPage = () => {
 const [avatar, setAvatar] = useState({
  file: null,
  url: "",
 });
 // Avatar
 const handleAvatar = (e) => {
  if (e.target.files[0]) {
   setAvatar({
    file: e.target.files[0],
    url: URL.createObjectURL(e.target.files[0]),
   });
  }
 };
 // Login
 const handleLogin = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { email, password } = Object.fromEntries(formData);
  try {
   await signInWithEmailAndPassword(auth, email, password);
   toast.success("Login successful");
  } catch (error) {
   console.log(error);
   toast.error(error.message);
  }
 };
 //  Registrations for new users
 const handleRegister = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { username, password, email } = Object.fromEntries(formData);
  // VALIDATE INPUTS
  if (!username || !email || !password) return toast.warn("Please enter inputs!");
  if (!avatar.file) return toast.warn("Please upload an avatar!");
  // VALIDATE UNIQUE USERNAME
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
   return toast.warn("Select another username");
  }
  try {
   const res = await createUserWithEmailAndPassword(auth, email, password);
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
  } catch (error) {
   console.log(error);
   toast.error(error.message);
  }
 };
 //
 return (
  <div className="login w-full h-full flex flex-col items-center gap-2 p-10">
   {/* LOGIN */}
   <div className="item  flex-1 flex flex-col items-center gap-2">
    <h2>Welcome Back</h2>
    <form className="flex flex-col items-center justify-center gap-3 " onSubmit={handleLogin}>
     <input type="email" placeholder="Email" name="email" />
     <input type="password" placeholder="Password" name="password" />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl ">Sign In</button>
    </form>
   </div>
   {/* Separator */}
   <div className="separator w-1/2 border border-gray-800"></div>
   {/* CREATE */}
   <div className="item flex-1 flex flex-col items-center gap-2">
    <h2>Create an Account</h2>
    <form className="flex flex-col items-center justify-center gap-3" onSubmit={handleRegister}>
     <label htmlFor="file">
      <img src={avatar.url || "./avatar.png"} alt="avatar" className="w-12 h-12 rounded-full object-cover opacity-40" />
      Upload an Image
     </label>
     <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
     <input type="text" placeholder="Username" name="username" />
     <input type="email" placeholder="Email" name="email" />
     <input type="password" placeholder="Password" name="password" />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl">Sign Up </button>
    </form>
   </div>
  </div>
 );
};

export default LoginPage;
