"use client"

import React, { useState, useLayoutEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast, {Toaster} from "react-hot-toast";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import Link from 'next/link';
import ModalForDelete from './ModalForDelete';
import {IoMdInformationCircleOutline} from "react-icons/io"

const OrderRecord = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)

    const [decodedJWTToken, setDecodedJWTToken] = useState("")
  
    const [isLoading, setIsLoading] = useState(true)
    const [orderRecordsShown, setOrderRecordsShown] = useState([])
    const [initialOrderRecordsShown, setInitialOrderRecordsShown] = useState([])

    const [errorInformation, setErrorInformation] = useState("")

    //state for toggling the delete modal
    const [toggleModal, setToggleModal] = useState(false)

    //state for the record object containing the record id and what table it is from
    const [recordToDelete, setRecordToDelete] = useState({
        recordId: null,
        table: "",
        index: null
    })

    const [disableButton, setDisableButton] = useState(false)

    
    //function for filtering the order record base on DSP
    const handleFilterDSP = (e) => {
        e.preventDefault()
        const arrayOfFilteredDSP = initialOrderRecordsShown.filter((order) => {
            return order.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredDSP)
    }
     //function for filtering the order record base on the location
     const handleFilterLocation = (e) => {
        e.preventDefault()
        const arrayOfFilteredLocation = initialOrderRecordsShown.filter((order) => {
            return order.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredLocation)
    }
    
    //function for filtering the order record base on the account name
    const handleFilterAccountName = (e) => {
        e.preventDefault()
        const arrayOfFilteredAccountName = initialOrderRecordsShown.filter((order) => {
            return order.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredAccountName)
    }

    //function for filtering the order record by customer name
    const handleFilterCustomerName = (e) => {
        e.preventDefault()
        const arrayOfFilteredCustomerName = initialOrderRecordsShown.filter((order) => {
            return order.customer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredCustomerName)
    }

    //function for filtering order date
    const handleFilterByOrderDate = (e) => {
        e.preventDefault()
        const arrayOfFilteredOrderDate = initialOrderRecordsShown.filter((order) => {
            return new Date(order.order_date).toLocaleDateString().indexOf(e.target.value) !== -1
        })
        setOrderRecordsShown(arrayOfFilteredOrderDate)
    }

    //function for fetching all and latest order records
    //this function checks first if the user is authorized or unauthorized, if authorized fetches all the records and if not, only the records that this auth_id specifically inserted will be fetched
    const fetchAllOrderRecords = async (e, decodedToken) => {
        e?.preventDefault()
        setDisableButton(true)
        try {
            setIsLoading(true)
            let response;
            if (decodedToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) {
                const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`)
                response = data
            } else {
                const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/${decodedToken.id}`)
                response = data
            } 
            setInitialOrderRecordsShown(response.data)
            setOrderRecordsShown(response.data)
            setIsLoading(false)           
        } catch (error) {
            if (error?.response?.data) {
                setErrorInformation(error.response.data)
            } else {
                setErrorInformation({
                    status: "failed",
                    message: "Cannot connect to server..."
                })
            }
            toast.error("Error occurred, please try again", {
                duration: 3000,
                className: "text-2xl"
            })
        }
        setDisableButton(false)
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

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        setDecodedJWTToken(decodedToken)
        fetchAllOrderRecords(null, decodedToken)
    },[])

  return (
    <>
    {errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>
     {isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className={`bg-white text-center ${toggleModal ? "p-0 w-full" : "w-screen xl:w-[90%] my-5 p-2"} md:text-xl relative z-[999999999999]`}>
        {decodedJWTToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE ? <Link href={"/"} className='absolute left-3 bg-blue text-white p-1 m-1 rounded'>Home</Link>
        : <Link href={"/form/order"} className='absolute left-3 bg-blue text-white p-1 m-1 rounded'>Back</Link>}
        <h1 className='md:text-3xl font-bold mx-3 mb-2'>Order Records</h1>
        <h1>Number of records: {orderRecordsShown?.length}</h1>
        <ReactHTMLTableToExcel
        id="export-orders-button"
        className="text-center cursor-pointer bg-blue text-white p-1 shadow-2xl m-2 rounded"
        table="export-order-table"
        filename="Order records"
        sheet="Orders"
        buttonText="Export to Excel"
      />
        <label htmlFor='filterOrderDate' className='text-center bg-blue text-white p-1 shadow-2xl m-2 rounded'>Filter Date:</label>
        <input type='text' name='filterOrderDate' placeholder='MM/DD/YY' className='bg-whiteSmoke text-center border-2 rounded border-blue' onChange={handleFilterByOrderDate}></input>
        {decodedJWTToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && <button type='button'className='m-2 cursor-pointer bg-red text-white p-1 shadow-2xl rounded' onClick={() => {
            setRecordToDelete({
                recordId: null,
                table: "order",
                index: null
            })
            setToggleModal(true)
        }}>Delete All Records</button>}
        <div className='flex w-full justify-center items-center'>
        <IoMdInformationCircleOutline className='text-red'></IoMdInformationCircleOutline>
        <p>Click a record to delete</p>
        </div>
        <hr></hr>
        <input type='button' value={"Reload"} disabled={disableButton} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded' onClick={(e) => fetchAllOrderRecords(e, decodedJWTToken)}></input>
        <input type='search' placeholder='Search DSP' onChange={handleFilterDSP} className='text-center border border-black m-2'></input>
        <input type='search' name='filterLocation' placeholder='Search Location' onChange={handleFilterLocation} className='text-center border border-black m-2'></input>
        <input type='search' name='filterAccountName' placeholder='Search Account Name' onChange={handleFilterAccountName} className='text-center border border-black m-2'></input>
        <input type='search' name='filterCustomerName' placeholder='Search Customer Name' onChange={handleFilterCustomerName} className='text-center border border-black m-2'></input>
        <input type='button' name='sortByName' value={"Sort by Account name"} onClick={handleSortByName} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
        <input type='button' name='sortByLocation' value={"Sort by Location"} onClick={handleSortByLocation} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
        <input type='button' name='sortByOrderDate' value={"Sort by Order Date"} onClick={handleSortByOrderDate} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
        <div className='w-full overflow-auto'>
        <table id='export-order-table' className='border border-black m-auto lg:text-base min-w-full'>
            <thead>
            <tr>
                <th className='border border-black bg-red text-white'>Order Date</th>
                <th className='border border-black bg-red text-white'>Delivery Date</th>
                <th className='border border-black bg-red text-white'>Customer Name</th>
                <th className='border border-black bg-red text-white'>Account Name</th>
                <th className='border border-black bg-red text-white'>Product</th>
                <th className='border border-black bg-red text-white'>Quantity</th>
                <th className='border border-black bg-red text-white'>Price</th>
                <th className='border border-black bg-red text-white'>Term</th>
                <th className='border border-black bg-red text-white'>Location</th>
                <th className='border border-black bg-red text-white'>DSP</th>
                <th className='border border-black bg-red text-white'>Freebies/Remarks/Concern</th>
                <th className='border border-black bg-red text-white'>Time Stamp</th>
            </tr>
            </thead>
            <tbody>
                {orderRecordsShown.map(({order_id, order_date, account_name, location, dsp, mat_description, quantity, price, customer_name, tin, contact, terms, remarks_freebies_concern, delivery_date, total_price, time_stamp}, i) => {
                    return (
                    <tr key={i} className='cursor-pointer' onClick={(e) => {
                        setRecordToDelete({
                            recordId: order_id,
                            table: "order",
                            index: i
                        })
                        setToggleModal(true)
                    }}>
                        <td className='border border-black text-center'>{new Date(order_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{new Date(delivery_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{customer_name}</td>
                        <td className='border border-black text-center'>{account_name}</td>
                        <td className='border border-black text-center'>{mat_description}</td>
                        <td className='border border-black text-center'>{quantity}</td>
                        <td className='border border-black text-center'>{price}</td>
                        <td className='border border-black text-center'>{terms}</td>
                        <td className='border border-black text-center'>{location}</td>
                        <td className='border border-black text-center'>{dsp}</td>
                        <td className='border border-black text-center'>{remarks_freebies_concern}</td>
                        <td className='border border-black text-center'>{new Date(Number(time_stamp)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
        </div>
            {toggleModal && <ModalForDelete setToggleModal={setToggleModal} recordToDelete={recordToDelete} setRecordToDelete={setRecordToDelete} arrayOfRecordsShown={orderRecordsShown} setArrayOfRecordsShown={setOrderRecordsShown}></ModalForDelete>}
    </div>
    <Toaster></Toaster>
    </>}
    </>
    }
   </>
  )
}

export default OrderRecord