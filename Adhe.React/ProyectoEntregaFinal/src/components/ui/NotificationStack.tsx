import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";

const NotificationStack: React.FC = () => {
  return (
    <ToastContainer autoClose={3000} closeButton closeOnClick position="top-right" role="alert" />
  );
};

export default NotificationStack;
