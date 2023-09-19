import React from "react";
import { ToastContainer } from "react-toastify";

const CustomToaster = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default CustomToaster;
