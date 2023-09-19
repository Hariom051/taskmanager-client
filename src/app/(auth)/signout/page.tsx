"use client"
import { axiosInstance } from '@/shared/services/axiosInstance'
import { toaster } from '@/shared/utils/toastify'
import { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useEffect } from 'react'
const Signout:NextPage = () => {
   useEffect(()=>{
         const signout =async()=>{
          signOut({callbackUrl:"/login",redirect:true});
         try{
            await  axiosInstance.get("/logout");
         }
         catch(e:any){
        
         }
         }
         signout()
    },[])
  return (
    <div>
      Sign out , come back soon!!!
    </div>
  )
}

export default Signout
