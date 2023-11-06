"use client"

import React, { useState, useRef, useLayoutEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast, {Toaster} from "react-hot-toast";
import { useDownloadExcel } from 'react-export-table-to-excel';
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import Link from 'next/link';

const ProductRecord = ({data}) => {

    const router = useRouter()

    const tableRef = useRef(null)

    const token = useStore((state) => state.token)
 
    const [isLoading, setIsLoading] = useState(true)
    const [productRecordsShown, setProductRecordsShown] = useState(data.data)

    //function for filtering records by product name
    const handleFilterByProductName = (e) => {
        e.preventDefault()
        const arrayOfFilteredProductName = data.data.filter((product) => {
            return product.mat_description.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setProductRecordsShown(arrayOfFilteredProductName)
    }

    //function for filtering product by product family
    const handleFilterByProductFamily = (e) => {
        e.preventDefault()
        const arrayOfFilteredProductFamily = data.data.filter((product) => {
            return product.product_family?.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setProductRecordsShown(arrayOfFilteredProductFamily)
    }

    //function for fetching all the product records
    const fetchAllProductRecords = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`)
            setProductRecordsShown(data.data)
            setIsLoading(false)
        } catch (error) {
            toast.error("Error occurred, please try again", {
                duration: 3000,
                className: "text-2xl"
            })
        }
    }

    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Product Records Table",
        sheet: "Products"
    })

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) {
          router.replace("/auth/login")
        } else {
          setIsLoading(false)
        }
    },[])

  return (
    <>{data.status === "failed" || data.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{data.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <div className=' bg-white p-2 text-center my-5 md:text-xl relative w-screen lg:w-[90%]'>
    <Link href={"/"} className='absolute left-3 bg-blue text-white rounded p-1 m-1'>Home</Link>
       <h1 className='md:text-3xl font-bold mx-3 mb-2'>Product Records</h1>
       <h1>Number of records: {productRecordsShown.length}</h1>
       <input type='button' value={"Reload"} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded' onClick={fetchAllProductRecords}></input>
       <button type='button' onClick={onDownload} className='text-center cursor-pointer bg-blue text-white p-1 shadow-2xl m-2 rounded'>Download Table</button>
       <hr></hr>
        <input type='search' name='filterProductName' placeholder='Search Product Name' onChange={handleFilterByProductName} className='text-center border border-black m-2'></input>
        <input type='search' name='filterProductFamily' placeholder='Search Product Family' onChange={handleFilterByProductFamily} className='text-center border border-black m-2'></input>
       <table className='border border-black min-w-full m-auto' ref={tableRef}>
           <thead>
           <tr>
               <th className='border border-black bg-red text-white'>Product ID</th>
               <th className='border border-black bg-red text-white'>Material Code</th>
               <th className='border border-black bg-red text-white'>Material Description</th>
               <th className='border border-black bg-red text-white'>Product Family</th>
           </tr>
           </thead>
           <tbody>
               {productRecordsShown.map(({product_id, mat_code, mat_description, product_family}, i) => {
                   return (
                       <tr key={i}>
                       <td className='border border-black text-center'>{product_id}</td>
                       <td className='border border-black'>{mat_code}</td>
                       <td className='border border-black'>{mat_description}</td>
                       <td className='border border-black'>{product_family}</td>
                   </tr>
                   )
               })}
           </tbody>
       </table>
       <Toaster></Toaster>
   </div></>}</>
    }</>
  )
}

export default ProductRecord