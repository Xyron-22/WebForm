"use client"

import React, { useState, useRef } from 'react'
import Link from "next/link"
import axios from "axios"
import toast, {Toaster} from "react-hot-toast"

const ForgotPassword = () => {

    const form = useRef(null)

    const [isConfirmed, setIsConfirmed] = useState(false)

    const [disableButton, setDisableButton] = useState(false)

    //function for sending email to backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/forgotpassword`, form.current, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            toast.success("Email sent", {
                duration: 3000,
                className: "text-2xl"
              })
            setIsConfirmed(true)
            setDisableButton(false)
        } catch (error) {
          setDisableButton(false)
            toast.error(error?.response?.data?.message, {
                duration: 3000,
                className: "text-2xl"
              })
        }
    }

  return (
    <>
    <form className='w-full sm:w-[80%] lg:w-[40%] h-[50vh] bg-white text-center' ref={form} onSubmit={handleSubmit}>
         <h1 className='text-lg md:text-3xl lg:text-4xl font-bold text-center py-5 h-auto w-full bg-gradient-to-r from-darkRed via-red to-darkRed text-white'>Forgot Password</h1>
         <div className='flex items-center flex-wrap justify-evenly flex-col w-full min-h-[70%] text-lg'>
         <div className='flex flex-col w-[80%]'>
        <label htmlFor='email' className='m-3'>Enter your email:</label>
        <input type='email' name='email' required placeholder='Email' className='text-center border-black border rounded'></input>
        </div>
        <button type='submit' disabled={disableButton} className='mx-auto m-3 p-1 px-3 rounded bg-blue text-white font-bold md:text-xl hover:scale-110'>Confirm</button>
        <Link href={"/auth/login"} >Go back to login page</Link>
        </div>
        {isConfirmed && <h1>A password reset link has been sent to your email!</h1>}
    </form>
    <Toaster></Toaster>
    </>
  )
}

export default ForgotPassword