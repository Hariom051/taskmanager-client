import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "https://taskmanager-backend.onrender.com/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(async function (config){
       const session= await getSession();
       config.headers.Authorization = `${session?.user?.accessToken}`;
    
      return config;
    });
axiosInstance.interceptors.response.use(
  getSuccessResponseHandler(),
  getErrorResponseHandler()
);


function getSuccessResponseHandler() {
  return (response: any) => {
    return response;
  };
}

function getErrorResponseHandler() {
  return async (error:any) => {
    if (error.response?.status === 403) {
      window.location.href = "/signout";
    }
    return Promise.reject({ ...error });
  };
}

export { axiosInstance };
