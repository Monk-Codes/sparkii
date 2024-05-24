/* eslint-disable no-undef */
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../backend/firebase";
import { doc, setDoc } from "firebase/firestore";

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
  } else
   () => {
    setAvatar({
     file: null,
     url: "",
    });
   };
 };
 // Login
 const handleLogin = (e) => {
  e.preventDefault();
  toast.success("Login successful");
 };
 //  Registrations for new users
 const handleRegister = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { username, password, email } = Object.fromEntries(formData);
  try {
   const res = await createUserWithEmailAndPassword(auth, email, password);
   await setDoc(db, "users", res.user.uid),
    {
     username,
     email,
     id: res.user.uid,
     blocked: [],
    };
  } catch (error) {
   console.log(error);
   toast.error(error.message);
  }
  toast.success("Account created successfully");
 };
 //
 return (
  <div className="login w-full h-full flex flex-col items-center gap-2 p-10">
   {/* LOGIN */}
   <div className="item  flex-1 flex flex-col items-center gap-2">
    <h2>Welcome Back</h2>
    <form className="flex flex-col items-center justify-center gap-3 " onSubmit={handleLogin}>
     <input type="text" placeholder="Email" name="email" />
     <input type="text" placeholder="Password" name="password" />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl">SignIn</button>
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
     <input type="text" placeholder="Email" name="email" />
     <input type="password" placeholder="Password" name="password" />
     <button className="p-3 cursor-pointer bg-blue-300 hover:bg-blue-400 rounded-2xl">SignUp</button>
    </form>
   </div>
  </div>
 );
};

export default LoginPage;
