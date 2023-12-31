"use client"
import { axiosInstance } from '@/shared/services/axiosInstance'
import { toaster } from '@/shared/utils/toastify'
import { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useEffect } from 'react'
const Signout:NextPage = () => {
   useEffect(()=>{
    signOut({callbackUrl:"/login",redirect:true});
    
    },[])
  return (
    <div>
      Sign out , come back soon!!!
    </div>
  )
}

export default Signout
