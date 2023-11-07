"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import { jwtDecode } from 'jwt-decode'
import {Toaster} from "react-hot-toast"
import Link from 'next/link'
import {RiDeleteBin6Line} from "react-icons/ri"
import {GrTableAdd, GrTable} from "react-icons/gr"
import {IoMdOpen} from "react-icons/io"

const Home = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)
    const setTokenToNull = useStore((state) => state.setTokenToNull)

    const [isLoading, setIsLoading] = useState(true)

    const handleLogout = () => {
        Cookies.remove("jwt")
        setTokenToNull()
        router.replace("/auth/login")
    }

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        setIsLoading(false)
    },[])

  return (<>{
    isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className='w-full md:w-[90%] xl:w-[70%] bg-white rounded text-center flex flex-wrap justify-center items-center flex-col'>
        <h1 className='py-5 text-lg md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-darkRed via-red to-darkRed text-white w-full'>Admin Controls</h1>
        <h1 className='font-semibold md:text-3xl lg:text-4xl m-2 relative'>See Records<GrTable className='absolute bottom-[10%] left-[103%] text-base font-semibold md:text-2xl lg:text-3xl text-center'></GrTable></h1>
        <div className='w-full flex justify-center sm:text-xl md:text-2xl'>
        <Link href={"/records/order"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Order Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/product"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Product Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/account"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Account Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        </div>
        <h1 className='font-semibold md:text-3xl lg:text-4xl m-2 relative'>Insert Records<GrTableAdd className='absolute bottom-[10%] left-[103%] text-base font-semibold md:text-2xl lg:text-3xl text-center'></GrTableAdd></h1>
        <div className='w-full flex justify-center sm:text-xl md:text-2xl'>
        <Link href={"/form/order"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Order<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/form/product"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Product<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/form/account"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Account<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        </div>
        {/* <h1 className='m-2 font-semibold md:text-3xl lg:text-4xl text-center relative'>Delete Records<RiDeleteBin6Line className='absolute bottom-[4%] left-[100%] text-xl font-semibold md:text-3xl lg:text-4xl text-center'></RiDeleteBin6Line>      </h1>
        <div className='w-full flex justify-between sm:justify-center sm:text-xl md:text-2xl'>
        <Link href={"/records/order"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Order<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/product"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Product<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/account"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative'>Account<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        </div> */}
        <button type='button' onClick={handleLogout} className='m-5 font-bold md:text-xl rounded bg-blue text-white p-2 hover:scale-110'>Logout</button>
    </div>
    <Toaster></Toaster>
    </>
  }</>
  )
}

export default Home