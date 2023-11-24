"use client"

import React, { useLayoutEffect,  useState, useRef } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import useStore from '@/stateManagement/store';
import { useRouter } from 'next/navigation';
import toast, {Toaster} from "react-hot-toast";
import Link from 'next/link';
import ReactLoading from "react-loading";

const ProductForm = () => {
const form = useRef(null)

const token = useStore((state) => state.token)
    
const router = useRouter()
const [isLoading, setIsLoading] = useState(true)

const [product, setProduct] = useState({
    matCode: "",
    matDescription: "",
    productFamily: ""
})

const [disableButton, setDisableButton] = useState(false)

const handleSubmit = async (e) => {
    e.preventDefault()
    setDisableButton(true)
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`, form.current, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        setProduct({
            matCode: "",
            matDescription: "",
            productFamily: ""
        })
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
    setDisableButton(false)
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
        <h1 className='m-7 md:m-10 text-xl text-center md:text-4xl font-extrabold'>INSERT PRODUCT</h1>    
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='orderDate' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold relative'>MATERIAL CODE</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{product.matCode}</h1>
        <input type='number' name='matCode' placeholder='Enter Number' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' value={product.matCode} onChange={(e) => setProduct({...product, matCode: e.target.value})} required></input>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='orderDate' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold'>MATERIAL DESCRIPTION</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{product.matDescription}</h1>
        <textarea type='text' placeholder='Enter Description' name='matDescription' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' value={product.matDescription} onChange={(e) => setProduct({...product, matDescription: e.target.value})} required></textarea>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <label htmlFor='orderDate' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold'>PRODUCT FAMILY</label>
        <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{product.productFamily}</h1>
        <input type='text' placeholder='Enter Product Family' name='productFamily' className='text-lg md:text-2xl mt-5 text-center border border-black rounded' defaultValue={null} value={product.productFamily} onChange={(e) => setProduct({...product, productFamily: e.target.value})}></input>
        <hr className='border-[1px] border-black w-[90%] my-3'/>
        <button type='submit' disabled={disableButton} className='mb-5 m-2 text-lg md:text-2xl p-2 rounded bg-blue text-white font-semibold'>Submit Form</button>
    </form>
    <Toaster></Toaster>   
    </>}</>
  )
}

export default ProductForm