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
  console.log("Login attempt with email:", email);
  try {
   await signInWithEmailAndPassword(auth, email, password);
   navigate("/list");
   toast.success("Login successful");
  } catch (error) {
   console.error("Login error:", error);
   toast.error("Please login with correct credentials");
  }
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
   console.log("Avatar uploaded to URL:", imgUrl);
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
   navigate("/list");
   toast.success("Account created successfully");
   toast.success("You can Login now");
  } catch (error) {
   console.error("Registration error:", error);
   toast.error(error.message);
  }
 };

 return (
  <div className="login w-full h-full flex flex-col items-center gap-2 p-10">
   <div className="item flex-1 flex flex-col items-center gap-2">
    <h2>Welcome Back</h2>
    <form className="flex flex-col items-center justify-center gap-1" onSubmit={handleLogin}>
     <input type="email" placeholder="Email" name="email" required />
     <input type="password" placeholder="Password" name="password" required minLength={6} />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl">Log In</button>
    </form>
   </div>

   <div className="separator w-1/2 border border-gray-800 my-4"></div>

   <div className="item flex-1 flex flex-col items-center gap-2">
    <h2>Create an Account</h2>
    <form className="flex flex-col items-center justify-center gap-1" onSubmit={handleRegister}>
     <label htmlFor="file">
      <img src={avatar.url || "./avatar.png"} alt="avatar" className="w-12 h-12 rounded-full object-cover opacity-40" />
      <span>Upload an Image</span>
     </label>
     <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
     <input type="text" placeholder="Username" name="username" required minLength={6} />
     <input type="email" placeholder="Email" name="email" required />
     <input type="password" placeholder="Password" name="password" required minLength={6} />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl">Sign Up</button>
    </form>
   </div>
  </div>
 );
};

export default LoginPage;
