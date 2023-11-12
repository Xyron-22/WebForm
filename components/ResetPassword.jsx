"use client"

import React, {useState, useRef} from 'react'
import axios from 'axios'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import toast, {Toaster} from "react-hot-toast"
import Link from 'next/link'

const ResetPasswordForm = ({params}) => {
    const form = useRef(null)

    const [toggleHideConfirmPassword, setToggleHideConfirmPassword] = useState(false)
    const [toggleHidePassword, setToggleHidePassword] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    const [disableButton, setDisableButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/resetpassword/${params.token}`, form.current, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setIsConfirmed(true)
            toast.success("Password changed successfully", {
                duration: 3000,
                className: "text-2xl"
              })
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
    <form className='w-full sm:w-[80%] lg:w-[40%] h-[50vh] bg-white' ref={form} onSubmit={handleSubmit}>
        <h1 className='text-lg md:text-3xl lg:text-4xl font-bold text-center py-5 h-auto w-full bg-gradient-to-r from-darkRed via-red to-darkRed text-white'>Reset Password</h1>
        <div className='flex items-center flex-wrap justify-evenly flex-col w-full min-h-[70%] text-lg'>
        <div className='flex flex-col w-[80%] relative'>
          <label htmlFor='password' className='ml-1'>Password</label>
        <input type={toggleHidePassword ? "text" : "password"} name='password' required placeholder='Enter password' className='text-center border-black border rounded'></input>
        {toggleHidePassword ? <AiFillEye className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEye>
        : <AiFillEyeInvisible className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEyeInvisible>  
        }
        </div>
        <div className='flex flex-col w-[80%] relative'>
          <label htmlFor='confirmPassword' className='ml-1'>Confirm Password</label>
        <input type={toggleHideConfirmPassword ? "text" : "password"} name='confirmPassword' required placeholder='Confirm Password' className='text-center border-black border rounded'></input>
        {toggleHideConfirmPassword ? <AiFillEye className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEye>
        : <AiFillEyeInvisible className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEyeInvisible>  
        }
        </div>
            <button type='submit' disabled={disableButton} className='mx-auto m-3 p-1 px-3 rounded bg-blue text-white font-bold md:text-xl hover:scale-110'>Confirm</button>
            <Link href={"/auth/login"} >Go back to login page</Link>
        </div>
        {isConfirmed && <h1 className='text-center'>Your password has been changed, login with your new password</h1>}
        <Toaster></Toaster>
    </form>
  )
}

export default ResetPasswordForm