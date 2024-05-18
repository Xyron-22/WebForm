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
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner,
    Alert
  } from "@material-tailwind/react";
   
const LoginForm = () => {

    const form = useRef()

  const router = useRouter()

  const setToken = useStore((state) => state.setToken)
 
  const token = useStore((state) => state.token)
   
  //state if registered or not
  const [isRegistered, setIsRegistered] = useState(true)
  //state for toggling the hide password
  const [toggleHidePassword, setToggleHidePassword] = useState(false)
  //state for toggling the hide confirm password
  const [toggleHideConfirmPassword, setToggleHideConfirmPassword] = useState(false)
  const [openAlert, setOpenAlert] = useState({
    status: false,
    message: "",
    color: "green"
  })
  let timeOut;
  //state set to true if currently sending a request
  const [isConnecting, setIsConnecting] = useState(false)

  //state if the connection and response takes too long
  const [connectLost, setConnectionLost] = useState(false)

  //state for disabling buttons after sending a request
  const [disableButton, setDisableButton] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setDisableButton(true)
    setIsConnecting(true)
    try {
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${isRegistered ? "signin" : "signup"}`, form.current, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        Cookies.set("jwt", data.token)
        setToken()
        const decodedToken = jwtDecode(data.token)
        if(decodedToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/")
        if(decodedToken.role === process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/form/order")
    } catch (error) {
            clearTimeout(timeOut)
            setOpenAlert({
                status: true,
                message: error?.response?.data || "Cannot connect to server...",
                color: "orange"
            })
            timeOut = setTimeout(() => {
                setOpenAlert({
                    ...openAlert,
                    status: false,
                    message: ""
                })
            }, 3000)
    }
    setIsConnecting(false)
    setDisableButton(false)
  }

  useLayoutEffect(() => {
    if (token) router.replace("/")
  }, [])

    return (
        <>
       <Card color="white" shadow={true} className="p-4 m-2 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <Typography variant="h4" color="blue-gray" className='flex justify-between items-center'>
            {isRegistered ? "Sign In" : "Sign Up"}{isConnecting && <Spinner color='white'></Spinner>}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to {isRegistered ? "sign in" : "sign up"}.
        </Typography>
        <form className="mt-8 mb-2 w-full" ref={form}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
            type='email'
            name='email' 
            required
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
            </Typography>
            <Input
            type={toggleHidePassword ? "text" : "password"} 
            name='password' 
            required
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            icon={toggleHidePassword ? <AiFillEye className='text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEye>
            : <AiFillEyeInvisible className='text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEyeInvisible>  
            }
            />
            {!isRegistered && 
            <>
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Confirm Password
                </Typography>
                <Input 
                type={toggleHideConfirmPassword ? "text" : "password"} 
                name='confirmPassword' 
                required 
                placeholder="********"
                size="lg"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                icon={toggleHideConfirmPassword ? <AiFillEye className='text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEye>
                : <AiFillEyeInvisible className='text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEyeInvisible>  
                }
                ></Input>
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Role
                </Typography>
                <Input 
                type='text' 
                name='role' 
                required 
                placeholder='Role'
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                size="lg"
                >
                </Input>
            </>
            }
          </div>
          <Button type='submit' disabled={disableButton} color="blue-gray" variant="gradient" className="mt-6" fullWidth onClick={handleSubmit}>
            {isRegistered ? "Sign In" : "Sign Up"}
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal cursor-pointer hover:underline" onClick={() => setIsRegistered(!isRegistered)}>
            {isRegistered ? "Not registered yet? Click here" : "Already have an account? Click here"}
          </Typography>
          <Link className="mt-4 text-center w-full flex justify-center font-normal cursor-pointer hover:underline" href={"/auth/forgotpassword"}>Forgot password?</Link>
        </form>
      </Card>
      <div className='absolute top-0 w-full flex justify-center'>
            <Alert
              open={openAlert.status}
              onClose={() => {
                clearTimeout(timeOut)
                setOpenAlert({...openAlert, status: false})
              }}
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              className="text-black w-auto z-20"
              color={openAlert.color}
            >
              {openAlert.message}
            </Alert>  
        </div>
      </>
    );
  }

export default LoginForm