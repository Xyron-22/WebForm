"use client"

import React, { useLayoutEffect, useState } from 'react'
import useStore from '@/stateManagement/store'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const Navbar = () => {

    const setTokenToNull = useStore((state) => state.setTokenToNull)

    const router = useRouter()

    const handleLogout = () => {
        Cookies.remove("jwt")
        setTokenToNull()
        router.replace("/auth/login")
    }

  return (
    <div className="w-[15%] h-[86vh] overflow-auto bg-[#222b3c] border-r-2 border-lightText">
        <div className='w-full h-full'>
        <div className='w-full text-center h-[7vh] flex justify-center items-center text-white bg-dark relative'>
            <h1 className='font-bold'>Navigation</h1>
        </div>
        <hr className='w-[90%] text-lightText m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='p-2 pl-5 text-sm text-lightText'>RECORDS</h1>
            <Link href={"/records/order"} className='ml-10 my-1 text-white font-semibold'>Orders</Link>
            <Link href={"/records/account"} className='ml-10 my-1 text-white font-semibold'>Accounts</Link>
            <Link href={"/records/product"} className='ml-10 my-1 text-white font-semibold'>Products</Link>
        </div>
        <hr className='w-[90%] text-lightText m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='p-2 pl-5 text-sm text-lightText'>FORMS</h1>
            <Link href={"/form/order"} className='ml-10 my-1 text-white font-semibold'>New order</Link>
            <Link href={"/form/account"} className='ml-10 my-1 text-white font-semibold'>New account</Link>
            <Link href={"/form/product"} className='ml-10 my-1 text-white font-semibold'>New product</Link>
        </div>
        <hr className='w-[90%] text-lightText m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='p-2 pl-5 text-sm text-lightText'>ANALYTICS</h1>
            <Link href={"/form/order"} className='ml-10 my-1 text-white font-semibold'>Charts</Link>
            <Link href={"/form/account"} className='ml-10 my-1 text-white font-semibold'>Logs</Link>
        </div>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
        <button type='button' onClick={handleLogout} className='m-5 font-bold sm:text-xl md:text-2xl px-10 rounded-full bg-medium text-white p-2 hover:scale-110'>Logout</button>
        </div>
        </div>
    </div>
  )
}

export default Navbar