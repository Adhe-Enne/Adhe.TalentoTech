import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";

const NotificationStack: React.FC = () => {
  return (
    <ToastContainer
      autoClose={3000}
      closeButton
      closeOnClick
      draggable
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="top-right"
      role="alert"
      rtl={false}
      theme="light"
    />
  );
};

export default NotificationStack;
