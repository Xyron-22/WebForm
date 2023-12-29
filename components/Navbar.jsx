"use client"

import React from 'react'
import useStore from '@/stateManagement/store'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import {BsTable, BsCart4} from "react-icons/bs"
import {VscAccount} from "react-icons/vsc"
import {AiOutlineFileAdd} from "react-icons/ai"
import {IoPersonAddOutline} from "react-icons/io5"
import {MdOutlineAddCircleOutline, MdClose} from "react-icons/md"

const Navbar = ({toggleNavbar, setToggleNavbar}) => {

    const setTokenToNull = useStore((state) => state.setTokenToNull)

    const router = useRouter()

    const handleLogout = () => {
        Cookies.remove("jwt")
        setTokenToNull()
        router.replace("/auth/login")
    }

  return (
    <div className={`w-full absolute top-0 md:w-[15%] z-[99999] md:sticky h-full md:min-h-screen overflow-auto bg-[#222b3c] md:border-r-[1px] border-lightText ${toggleNavbar ? "inline" : "hidden"} md:inline`}>
        <div className='w-full h-full'>
        <div className='w-full text-center h-[7vh] flex justify-center items-center text-white bg-dark relative'>
            <h1 className='font-bold'>Navigation</h1>
            <MdClose className='absolute right-3 top-3 text-2xl md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}/>
        </div>
        <hr className='w-[90%] text-light m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='lg:p-2 lg:pl-2 xl:pl-5 text-sm text-lightText'>RECORDS</h1>
            <Link href={"/records/order"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><BsTable className='mr-1'></BsTable>Orders</Link>
            <Link href={"/records/account"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><VscAccount className='mr-1'></VscAccount>Accounts</Link>
            <Link href={"/records/product"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><BsCart4 className='mr-1'></BsCart4>Products</Link>
        </div>
        <hr className='w-[90%] text-light m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='lg:p-2 lg:pl-2 xl:pl-5 text-sm text-lightText'>FORMS</h1>
            <Link href={"/form/order"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><AiOutlineFileAdd className='mr-1'></AiOutlineFileAdd>New order</Link>
            <Link href={"/form/account"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><IoPersonAddOutline className='mr-1'></IoPersonAddOutline>New account</Link>
            <Link href={"/form/product"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold flex items-center'><MdOutlineAddCircleOutline className='mr-1'></MdOutlineAddCircleOutline>New product</Link>
        </div>
        <hr className='w-[90%] text-light m-auto'></hr>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-dark p-5'>
            <h1 className='lg:p-2 lg:pl-2 xl:pl-5 text-sm text-lightText'>ANALYTICS</h1>
            <Link href={"#orders"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Orders</Link>
            <Link href={"#orders"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Outlets</Link>
            <Link href={"#volume"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Volume</Link>
            <Link href={"#volume"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Products</Link>
            <Link href={"#sales"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Sales</Link>
            <Link href={"#dsp"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>DSP</Link>
            <Link href={"#products/accounts"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Products</Link>
            <Link href={"#products/accounts"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}>Accounts</Link>
            <Link href={"#orders"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Orders</Link>
            <Link href={"#orders"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Outlets</Link>
            <Link href={"#volume"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Volume</Link>
            <Link href={"#volume"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Products</Link>
            <Link href={"#sales"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Sales</Link>
            <Link href={"#dsp"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>DSP</Link>
            <Link href={"#products/accounts"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Products</Link>
            <Link href={"#products/accounts"} className='lg:ml-5 xl:ml-10 my-1 text-white font-semibold hidden md:inline'>Accounts</Link>
        </div>
        <div className='w-full text-center h-[7vh] flex justify-center items-center text-white bg-dark relative'>
        <button type='button' onClick={handleLogout} className='m-auto font-bold text-white p-2 hover:scale-110'>Logout</button>
        </div>
        </div>
    </div>
  )
}

export default Navbar