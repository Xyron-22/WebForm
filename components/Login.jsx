"use client"

import React, {useState, useRef, useLayoutEffect, useEffect} from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import axios from "axios"
import { useRouter } from 'next/navigation'
import useStore from '@/stateManagement/store'
import toast, {Toaster} from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'

const LoginForm = () => {

  const form = useRef()

  const router = useRouter()

  const setToken = useStore((state) => state.setToken)
  // const extractJwtFromStorage = useStore((state) => state.extractJwtFromStorage)
  const token = useStore((state) => state.token)
   
  const [isRegistered, setIsRegistered] = useState(true)
  const [toggleHidePassword, setToggleHidePassword] = useState(false)
  const [toggleHideConfirmPassword, setToggleHideConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${isRegistered ? "signin" : "signup"}`, form.current, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        Cookies.set("jwt", data.token)
        setToken()
        toast.success("Successfully Logged In", {
          duration: 3000,
          className: "text-2xl"
        })
        const decodedToken = jwtDecode(data.token)
        if(decodedToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/")
        if(decodedToken.role === process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/form/order")
    } catch (error) {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          className: "text-2xl"
        })
    }
  }

  useLayoutEffect(() => {
    if (token) router.replace("/")
  }, [])

  return (
    <div className='w-full min-h-full flex justify-center items-center'>
    <form className='flex flex-wrap items-center flex-col w-[90%] lg:w-[50%] bg-white shadow-2xl rounded justify-center' ref={form} onSubmit={handleSubmit}>
      <h1 className='text-lg md:text-3xl lg:text-4xl font-bold text-center py-5 h-auto w-full bg-gradient-to-r from-darkRed via-red to-darkRed text-white'>{isRegistered ? "Login" : "Register"}</h1>
      <div className='flex items-center flex-wrap justify-center flex-col w-full min-h-[30vh] text-lg'>
        <div className='flex flex-col w-[80%]'>
        <label htmlFor='email' className='ml-1'>Email</label>
        <input type='email' name='email' required placeholder='Email' className='text-center border-black border rounded'></input>
        </div>
        <div className='flex flex-col w-[80%] relative'>
          <label htmlFor='password' className='ml-1'>Password</label>
        <input type={toggleHidePassword ? "text" : "password"} name='password' required placeholder='Password' className='text-center border-black border rounded'></input>
        {toggleHidePassword ? <AiFillEye className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEye>
        : <AiFillEyeInvisible className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEyeInvisible>  
        }
        </div>
        {isRegistered ? <></> : <>
        <div className='flex flex-col w-[80%] relative'>
          <label htmlFor='confirmPassword' className='ml-1'>Confirm Password</label>
        <input type={toggleHideConfirmPassword ? "text" : "password"} name='confirmPassword' required placeholder='Confirm Password' className='text-center border-black border rounded'></input>
        {toggleHideConfirmPassword ? <AiFillEye className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEye>
        : <AiFillEyeInvisible className='absolute right-[3%] top-[55%] text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEyeInvisible>  
        }
        </div>
        <div className='flex flex-col w-[80%]'>
          <label htmlFor='role'  className='ml-1'>Role</label>
        <input type='text' name='role' required placeholder='Role' className='text-center border-black border rounded'></input>
        </div>
        </>}
        </div>
        <button type='submit' className='mx-auto m-3 p-1 px-3 rounded bg-blue text-white font-bold md:text-xl hover:scale-110'>{isRegistered ? "Login" : "Register"}</button>
        <button type='button' onClick={() => setIsRegistered(!isRegistered)} className='mx-auto'>{isRegistered ? "Not registered yet? Click here" : "Already have an account? Click here"}</button>
        <Link className='mx-auto my-5' href={"/auth/forgotpassword"}>Forgot password?</Link>
        <Toaster></Toaster>
    </form>
    </div>
  )
}

export default LoginForm