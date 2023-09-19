import { toast } from "react-toastify"
// here custom toaster are defined for custom color , progress and more 
export const toaster ={
    success(msg:string){
     return  toast.success(msg, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            })
    },
    error(msg:string){
      return toast.error(msg, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            })
    }
}