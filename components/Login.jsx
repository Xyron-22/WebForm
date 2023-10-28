"use client"

import React, {useState} from 'react'
import Link from 'next/link'

const LoginForm = () => {

  const [loginOrRegister, setLoginOrRegister] = useState(false)

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
    <form className='flex flex-wrap justify-center items-center flex-col w-[90%] h-[50vh]'>
      <h1>{loginOrRegister ? "Register" : "Login"}</h1>
        <input type='email' name='email' required placeholder='Email'></input>
        <input type='password' name='password' required placeholder='Password'></input>
        {loginOrRegister &&   <>
        <input type='password' name='confirmPassword' required placeholder='Confirm Password'></input>
        <input type='text' name='role' required placeholder='Role'></input>
        </>}
        <button type='button' onClick={() => setLoginOrRegister(!loginOrRegister)}>{loginOrRegister ? "Already have an account ? login here" : "No account ? Register here"}</button>
        <Link href={"/forgotpassword"}>Forgot password ?</Link>
    </form>
    </div>
  )
}

export default LoginForm