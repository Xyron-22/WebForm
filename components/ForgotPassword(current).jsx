"use client"

import React, { useState, useRef } from 'react'
import Link from "next/link"
import axios from "axios"
import toast, {Toaster} from "react-hot-toast"
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner,
    Alert
  } from "@material-tailwind/react";

const ForgotPasswordCurrent = () => {
    const form = useRef(null)

    const [isConfirmed, setIsConfirmed] = useState(false)

    const [disableButton, setDisableButton] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [openAlert, setOpenAlert] = useState({
        status: false,
        message: "",
        color: "green"
      })
    let timeOut;

    //function for sending email to backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        setIsLoading(true)
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/forgotpassword`, form.current, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            clearTimeout(timeOut)
            setOpenAlert({
                status: true,
                message: "Link sent to your email.",
                color: "green"
            })
            timeOut = setTimeout(() => {
                setOpenAlert({
                    ...openAlert,
                    status: false,
                    message: ""
                })
            }, 1000)
            setIsConfirmed(true)
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
        Forgot Password {isLoading && <Spinner color='white'></Spinner>}
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        {isConfirmed ? "A password reset link has been sent to your email." : "Nice to meet you! Enter your email to reset your password."} 
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
        </div>
        <Button type='submit' variant='gradient' color='blue-gray' disabled={disableButton} className="mt-6" fullWidth onClick={handleSubmit}>
          Confirm Email
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

export default ForgotPasswordCurrent