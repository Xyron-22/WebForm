"use client"

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import { jwtDecode } from 'jwt-decode'

const Home = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)
    const decodeToken = useStore((state) => state.decodeToken)

    const [isLoading, setIsLoading] = useState(true)

    const handleLogout = () => {
        Cookies.remove("jwt")
        router.replace("/auth/login")
    }

    useEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) {
          router.replace("/auth/login")
        } else {
            setIsLoading(false)
        }
    },[])

  return (<>{
    isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className='w-[80%] min-h-[40vh] bg-white text-center'>
        <h1>HOME PAGE</h1>
        <button type='button' onClick={handleLogout}>Logout</button>
    </div></>
  }</>
  )
}

export default Home