import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ToastContainer;
const Notification = () => {
 return (
  <div className="">
   <ToastContainer position="top-center" closeOnClick newestOnTop autoClose={300} theme="dark" limit={1} />
  </div>
 );
};

export default Notification;
