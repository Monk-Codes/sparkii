import { useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
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
  } else
   () => {
    setAvatar({
     file: null,
     url: "",
    });
   };
 };
 const handleLogin = (e) => {
  e.preventDefault();
  toast.success("Login successful");
 };
 return (
  <div className="login w-full h-full flex flex-col items-center gap-2 p-10">
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
   <div className="item flex-1 flex flex-col items-center gap-2">
    <h2>Create an Account</h2>
    <form className="flex flex-col items-center justify-center gap-3">
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
