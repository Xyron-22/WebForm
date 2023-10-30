"use client"

import React, {useState} from 'react'
import axios from 'axios'

const ResetPasswordForm = ({params}) => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorResponse, setErrorResponse] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/resetpassword/${params.token}`, {password, confirmPassword})
            console.log(data)
        } catch (error) {   
            console.log(error)
            setErrorResponse(error.response?.data?.message)
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <h1>{errorResponse}</h1>
        <input type="password" name='password' onChange={(e) => setPassword(e.target.value)}></input>
        <input type="password" name='confirmPassword' onChange={(e) => setConfirmPassword(e.target.value)}></input>
        <button type='submit'>Reset Password</button>
    </form>
  )
}

export default ResetPasswordForm