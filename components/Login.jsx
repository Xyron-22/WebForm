"use client"

import React, {useState, useRef, useLayoutEffect} from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import {AiFillEyeInvisible, AiFillEye, AiOutlineLogin, AiOutlineMail} from "react-icons/ai"
import {BiRegistered} from "react-icons/bi"
import {RiLockPasswordLine} from "react-icons/ri"
import axios from "axios"
import { useRouter } from 'next/navigation'
import useStore from '@/stateManagement/store'
import toast, {Toaster} from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import ReactLoading from "react-loading";

const LoginForm = () => {

  const form = useRef()

  const router = useRouter()

  const setToken = useStore((state) => state.setToken)
 
  const token = useStore((state) => state.token)
   
  const [isRegistered, setIsRegistered] = useState(true)
  const [toggleHidePassword, setToggleHidePassword] = useState(false)
  const [toggleHideConfirmPassword, setToggleHideConfirmPassword] = useState(false)

  //
  const [isLoading, setIsLoading] = useState(<><h1>Connecting...</h1><ReactLoading type={"bubbles"} color={"#000000"} height={"5%"} width={"5%"} className="m-auto"></ReactLoading></>)
  const [isConnecting, setIsConnecting] = useState(false)

  const [disableButton, setDisableButton] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsConnecting(true)
      setTimeout(() => {
        setIsLoading(<><h1>Restoring Connection...</h1><ReactLoading type={"bubbles"} color={"#000000"} height={"2%"} width={"5%"} className="m-auto"></ReactLoading></>)
      }, 3000)
      setDisableButton(true)
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
      setDisableButton(false)
      console.log(error)
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
      <div className='text-lg md:text-3xl lg:text-4xl font-bold text-center py-5 h-auto w-full bg-gradient-to-r from-darkRed via-red to-darkRed text-white'>
        {isRegistered ? <h1 className='flex justify-center items-center'>Login<AiOutlineLogin></AiOutlineLogin></h1> : <h1 className='flex justify-center items-center'>Register<BiRegistered></BiRegistered></h1>}</div>
        {isConnecting && <div className='w-full text-center mt-5 mb-[-7%]'>{isLoading}</div>}
      <div className='flex items-center flex-wrap justify-center flex-col w-full min-h-[30vh] text-lg font-semibold'>
        <div className='flex flex-col w-[80%]'>
        <label htmlFor='email' className='ml-1 flex items-center'>Email<AiOutlineMail className='m-1'></AiOutlineMail></label>
        <input type='email' name='email' required placeholder='Email' className='text-center border-black border rounded'></input>
        </div>
        <div className='flex flex-col w-[80%] relative'>
          <label htmlFor='password' className='ml-1 flex items-center'>Password<RiLockPasswordLine className='m-1'></RiLockPasswordLine></label>
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
        <button type='submit' disabled={disableButton} className='mx-auto m-3 p-1 px-3 rounded bg-blue text-white font-bold sm:text-xl md:text-2xl hover:scale-110'>{isRegistered ? "Login" : "Register"}</button>
        <button type='button' onClick={() => setIsRegistered(!isRegistered)} className='mx-auto'>{isRegistered ? "Not registered yet? Click here" : "Already have an account? Click here"}</button>
        <Link className='mx-auto my-5' href={"/auth/forgotpassword"}>Forgot password?</Link>
        <Toaster></Toaster>
    </form>
    </div>
  )
}

export default LoginForm