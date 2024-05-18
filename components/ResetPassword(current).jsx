"use client"

import React, {useState, useRef} from 'react'
import axios from 'axios'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import toast, {Toaster} from "react-hot-toast"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner,
    Alert
  } from "@material-tailwind/react";

const ResetPasswordForm = ({params}) => {

    const router = useRouter()

    const form = useRef(null)

    const [toggleHideConfirmPassword, setToggleHideConfirmPassword] = useState(false)
    const [toggleHidePassword, setToggleHidePassword] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [openAlert, setOpenAlert] = useState({
        status: false,
        message: "",
        color: "green"
      })
    let timeOut;

    const [disableButton, setDisableButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        setIsLoading(true)
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/resetpassword/${params.token}`, form.current, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setIsConfirmed(true)
            clearTimeout(timeOut)
            setOpenAlert({
                status: true,
                message: "Password reset successful",
                color: "green"
            })
            timeOut = setTimeout(() => {
                setOpenAlert({
                    ...openAlert,
                    status: false,
                    message: ""
                })
                router.replace("/auth/login")
            }, 3000)
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
        setIsLoading(false)
        setDisableButton(false) 
    }

    return (
        <>
        <Card color="white" shadow={false} className="p-4 m-2 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
      <Typography variant="h4" color="blue-gray" className='flex justify-between items-center'>
        Reset Password {isLoading && <Spinner color='white'></Spinner>}
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        {isConfirmed ? "Your password has been changed, login with your new password." : "Nice to meet you! Enter your new password."} 
      </Typography>
      <form className="mt-8 mb-2 w-full" ref={form}>
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            New Password
          </Typography>
          <Input
          type={toggleHidePassword ? "text" : "password"} 
          name='password' 
          required 
          placeholder='Enter password'
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            icon={toggleHidePassword ? <AiFillEye className='text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEye>
            : <AiFillEyeInvisible className='text-2xl cursor-pointer' onClick={() => setToggleHidePassword(!toggleHidePassword)}></AiFillEyeInvisible>  
            }
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Confirm New Password
          </Typography>
          <Input
          type={toggleHideConfirmPassword ? "text" : "password"} 
          name='confirmPassword' 
          required 
          placeholder='Confirm Password'
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            icon={toggleHideConfirmPassword ? <AiFillEye className='text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEye>
            : <AiFillEyeInvisible className='text-2xl cursor-pointer' onClick={() => setToggleHideConfirmPassword(!toggleHideConfirmPassword)}></AiFillEyeInvisible>  
            }
          />
        </div>
        <Button type='submit' variant='gradient' color='blue-gray' disabled={disableButton} className="mt-6" fullWidth onClick={handleSubmit}>
          Set New Password
        </Button>
        <Link href={"/auth/login"} className="mt-4 text-center w-full flex justify-center font-normal cursor-pointer hover:underline">Go back to sign in page</Link>
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
    )
}   

export default ResetPasswordForm