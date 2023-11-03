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

const OrderRecord = ({data}) => {

    const router = useRouter()

    const tableRef = useRef(null)

    const token = useStore((state) => state.token)
   
    const [isLoading, setIsLoading] = useState(true)
    const [orderRecordsShown, setOrderRecordsShown] = useState(data.data)

    //function for filtering the order record base on DSP
    const handleFilterDSP = (e) => {
        e.preventDefault()
        const arrayOfFilteredDSP = data.data.filter((order) => {
            return order.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredDSP)
    }
     //function for filtering the order record base on the location
     const handleFilterLocation = (e) => {
        e.preventDefault()
        const arrayOfFilteredLocation = data.data.filter((order) => {
            return order.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredLocation)
    }
    
    //function for filtering the order record base on the account name
    const handleFilterAccountName = (e) => {
        e.preventDefault()
        const arrayOfFilteredAccountName = data.data.filter((order) => {
            return order.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredAccountName)
    }

    //function for filtering the order record by customer name
    const handleFilterCustomerName = (e) => {
        e.preventDefault()
        const arrayOfFilteredCustomerName = data.data.filter((order) => {
            return order.customer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredCustomerName)
    }

    //function for fetching all and latest order records
    const fetchAllOrderRecords = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`)
            setOrderRecordsShown(data.data)
        } catch (error) {
            toast.error("Error occurred, please try again", {
                duration: 3000,
                className: "text-2xl"
            })
        }
    }

    //function for sorting the records by account name
    const handleSortByName = () => {
        let tempArr = [...orderRecordsShown]
        tempArr.sort((a, b) => {
            if(a.account_name < b.account_name) {
                return -1
            } 
            if(a.account_name > b.account_name) {
                return 1
            }
            return 0
        })
        setOrderRecordsShown(tempArr)
    }

    //function for sorting the records by location
    const handleSortByLocation = () => {
        let tempArr = [...orderRecordsShown]
        tempArr.sort((a, b) => {
            if(a.location < b.location) {
                return -1
            } 
            if(a.location > b.location) {
                return 1
            }
            return 0
        })
        setOrderRecordsShown(tempArr)
    }
    
    //function for sorting the records by order date
    const handleSortByOrderDate = () => {
        let tempArr = [...orderRecordsShown]
        tempArr.sort((a,b) => Date.parse(b.order_date) - Date.parse(a.order_date))
        setOrderRecordsShown(tempArr)
    }


    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Order Records Table",
        sheet: "Orders"
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
    <>
    {data.status === "failed" || data.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{data.message}</div> : 
    <>
     {isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className=' bg-white p-2 text-center my-5 w-screen xl:w-[90%] md:text-xl relative'>
        <Link href={"/"} className='absolute left-3 bg-lightBlue p-1 m-1'>Home</Link>
        <h1 className='md:text-3xl font-bold mx-3 mb-2'>Order Records</h1>
        <h1>Number of records: {orderRecordsShown.length}</h1>
        <button type='button' onClick={onDownload} className='text-center cursor-pointer bg-lightBlue p-1 shadow-2xl m-2'>Download Table</button>
        <hr></hr>
        <input type='button' value={"Reload"} className='m-2 cursor-pointer bg-lightBlue p-1 shadow-2xl' onClick={fetchAllOrderRecords}></input>
        <input type='search' placeholder='Search DSP' onChange={handleFilterDSP} className='text-center border border-black m-2'></input>
        <input type='search' name='filterLocation' placeholder='Search Location' onChange={handleFilterLocation} className='text-center border border-black m-2'></input>
        <input type='search' name='filterAccountName' placeholder='Search Account Name' onChange={handleFilterAccountName} className='text-center border border-black m-2'></input>
        <input type='search' name='filterCustomerName' placeholder='Search Customer Name' onChange={handleFilterCustomerName} className='text-center border border-black m-2'></input>
        <input type='button' name='sortByName' value={"Sort by Account name"} onClick={handleSortByName} className='m-2 cursor-pointer bg-lightBlue p-1 shadow-2xl'></input>
        <input type='button' name='sortByLocation' value={"Sort by Location"} onClick={handleSortByLocation} className='m-2 cursor-pointer bg-lightBlue p-1 shadow-2xl'></input>
        <input type='button' name='sortByOrderDate' value={"Sort by Order Date"} onClick={handleSortByOrderDate} className='m-2 cursor-pointer bg-lightBlue p-1 shadow-2xl'></input>
        <div className='w-full overflow-auto'>
        <table className='border border-black m-auto lg:text-base min-w-full' ref={tableRef}>
            <thead>
            <tr>
                <th className='border border-black'>Order Date</th>
                <th className='border border-black'>Delivery Date</th>
                <th className='border border-black'>Customer Name</th>
                <th className='border border-black'>Contact Number</th>
                <th className='border border-black'>TIN</th>
                <th className='border border-black'>Product</th>
                <th className='border border-black'>Price</th>
                <th className='border border-black'>Quantity</th>
                <th className='border border-black'>Total Price</th>
                <th className='border border-black'>Term</th>
                <th className='border border-black'>Account Name</th>
                <th className='border border-black'>Location</th>
                <th className='border border-black'>DSP</th>
                <th className='border border-black'>Freebies/Remarks/Concern</th>
            </tr>
            </thead>
            <tbody>
                {orderRecordsShown.map(({order_date, account_name, location, dsp, mat_description, quantity, price, customer_name, tin, contact, terms, remarks_freebies_concern, delivery_date, total_price}, i) => {
                    return (
                        <tr key={i}>
                        <td className='border border-black text-center'>{new Date(order_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{new Date(delivery_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{customer_name}</td>
                        <td className='border border-black text-center'>{contact}</td>
                        <td className='border border-black text-center'>{tin}</td>
                        <td className='border border-black text-center'>{mat_description}</td>
                        <td className='border border-black text-center'>{price}</td>
                        <td className='border border-black text-center'>{quantity}</td>
                        <td className='border border-black text-center'>{total_price}</td>
                        <td className='border border-black text-center'>{terms}</td>
                        <td className='border border-black text-center'>{account_name}</td>
                        <td className='border border-black text-center'>{location}</td>
                        <td className='border border-black text-center'>{dsp}</td>
                        <td className='border border-black text-center'>{remarks_freebies_concern}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
        </div>  
    </div></>}
    </>
    }
   </>
  )
}

export default OrderRecord