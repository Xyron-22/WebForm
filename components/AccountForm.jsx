"use client"

import React, { useLayoutEffect,  useState, useRef } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import useStore from '@/stateManagement/store';
import { useRouter } from 'next/navigation';
import toast, {Toaster} from "react-hot-toast";
import Link from 'next/link';
import ReactLoading from "react-loading";
import DspData from '@/data/DspData';

const AccountForm = () => {
    const form = useRef(null)

    const token = useStore((state) => state.token)
    
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const [account, setAccount] = useState({
        customerNumber: null,
        accountName: null,
        location: null,
        dsp: null
    })

    //function for submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account`, form.current, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                } 
            })
            setAccount({
                customerNumber: null,
                accountName: null,
                location: null,
                dsp: null
            })
            e.target.reset()
            toast.success("Form Submitted", {
                duration: 3000,
                className: "text-2xl"
            })
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                className: "text-2xl"
            })
        }
    }
    
    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        setIsLoading(false)
      }, [])

  return (
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
        <form className='flex-col flex items-center w-screen lg:w-[80%] min-h-[60vh] bg-white shadow-2xl relative' ref={form} onSubmit={handleSubmit}>
        <Link href={"/"} className='absolute left-1 top-1 text-sm sm:left-3 sm:top-3 bg-blue text-white p-1 m-1 rounded md:text-xl'>Home</Link>
        <h1 className='m-7 md:m-10 text-xl text-center md:text-4xl font-extrabold'>INSERT ACCOUNT</h1>    
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='customerNumber' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold relative'>CUSTOMER NUMBER</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{account.customerNumber}</h1>
        <input type='text' name='customerNumber' placeholder='Enter Number' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => setAccount({...account, customerNumber: e.target.value})} required></input>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='accountName' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold'>ACCOUNT NAME</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{account.accountName}</h1>
        <textarea type='text' placeholder='Enter Account Name' name='accountName' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => setAccount({...account, accountName: e.target.value})} required></textarea>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='location' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold'>LOCATION</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{account.location}</h1>
        <input type='text' placeholder='Enter Location' name='location' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => setAccount({...account, location: e.target.value})} required></input>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <div className='flex'>
        {DspData.map((dsp, i) => {
            return (
                <>
                <div className='flex flex-col font-semibold px-2' key={i}>
                <label htmlFor='dsp' className='text-lg md:text-2xl'>{dsp}</label>
                <input type="radio" name='dsp' checked={account.dsp === dsp} value={dsp} onClick={(e) => setAccount({...account, dsp: e.target.value})} required></input>
                </div>
                </>
            )
        })}
        </div>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <button type='submit' className='mb-5 m-2 text-lg md:text-2xl p-2 rounded bg-blue text-white font-semibold'>Submit Form</button>
        </form>
        <Toaster></Toaster>
    </>}</>
  )
}

export default AccountForm