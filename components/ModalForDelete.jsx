"use client"

import React from 'react'
import axios from "axios"
import toast from 'react-hot-toast'
import useStore from '@/stateManagement/store'
import {AiFillWarning} from "react-icons/ai"

const ModalForDelete = ({setToggleModal, recordToDelete, arrayOfRecordsShown, setArrayOfRecordsShown}) => {

    const token = useStore((state) => state.token)
    
    //create a function for sending a delete method
    //this component functionalities is not finished yet, goal is to make this component reusable in different routes
    const handleSubmitDelete = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/${recordToDelete?.table}/${recordToDelete?.recordId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            let tempArr = [...arrayOfRecordsShown]
            tempArr.splice(recordToDelete?.index, 1)
            setArrayOfRecordsShown(tempArr)
            setToggleModal(false)
            toast.success("Record deleted", {
                duration: 3000,
                className: "text-2xl"
            })
        } catch (error) {
            toast.error(error.response.data.message, {
                duration: 3000,
                className: "text-2xl"
            })
        }
    }

  return (
    <div className='bg-black opacity-100 z-40 sticky bottom-0 w-full h-screen flex justify-center items-center '>
        <div className='w-full md:w-[60%] min-h-[40%] rounded-xl bg-white opacity-100 flex justify-center items-center flex-col z-50'>
        <p>Are you sure you want to delete this record?</p>
        <div className='flex w-full justify-center items-center m-3 flex-col'>
        <AiFillWarning className='text-red text-3xl'></AiFillWarning>
        <p>Order records that contains this {recordToDelete?.table} record will also be deleted</p>
        </div>
        <div className='overflow-auto w-[98%]'>
        {arrayOfRecordsShown.map((record, i) => {
            if (record.record_id) {
                if (record.record_id === recordToDelete?.recordId)
                return (
                    <table className='border border-black m-auto lg:text-base min-w-full text-sm'>
                        <thead>
                            <tr>
                                <th className='border border-black bg-red text-white'>Order Date</th>
                                <th className='border border-black bg-red text-white'>Delivery Date</th>
                                <th className='border border-black bg-red text-white'>Customer Name</th>
                                <th className='border border-black bg-red text-white'>Contact Number</th>
                                <th className='border border-black bg-red text-white'>TIN</th>
                                <th className='border border-black bg-red text-white'>Product</th>
                                <th className='border border-black bg-red text-white'>Price</th>
                                <th className='border border-black bg-red text-white'>Quantity</th>
                                <th className='border border-black bg-red text-white'>Total Price</th>
                                <th className='border border-black bg-red text-white'>Term</th>
                                <th className='border border-black bg-red text-white'>Account Name</th>
                                <th className='border border-black bg-red text-white'>Location</th>
                                <th className='border border-black bg-red text-white'>DSP</th>
                                <th className='border border-black bg-red text-white'>Freebies/Remarks/Concern</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={i}>
                            <td className='border border-black text-center'>{new Date(record.order_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{new Date(record.delivery_date).toLocaleDateString()}</td>
                        <td className='border border-black'>{record.customer_name}</td>
                        <td className='border border-black text-center'>{record.contact}</td>
                        <td className='border border-black text-center'>{record.tin}</td>
                        <td className='border border-black text-center'>{record.mat_description}</td>
                        <td className='border border-black text-center'>{record.price}</td>
                        <td className='border border-black text-center'>{record.quantity}</td>
                        <td className='border border-black text-center'>{record.total_price}</td>
                        <td className='border border-black text-center'>{record.terms}</td>
                        <td className='border border-black text-center'>{record.account_name}</td>
                        <td className='border border-black text-center'>{record.location}</td>
                        <td className='border border-black text-center'>{record.dsp}</td>
                        <td className='border border-black text-center'>{record.remarks_freebies_concern}</td>
                            </tr>
                        </tbody>
                    </table>
                )
            } else if (record.product_id) {
                if (record.product_id === recordToDelete?.recordId)
                return (
                <table className='border border-black m-auto lg:text-base min-w-full text-sm'>
                <thead>
                <tr>
                    <th className='border border-black bg-red text-white'>Product ID</th>
                    <th className='border border-black bg-red text-white'>Material Code</th>
                    <th className='border border-black bg-red text-white'>Material Description</th>
                    <th className='border border-black bg-red text-white'>Product Family</th>
                </tr>
                </thead>
                <tbody>
                        <tr key={i}>
                            <td className='border border-black text-center'>{record.product_id}</td>
                            <td className='border border-black'>{record.mat_code}</td>
                            <td className='border border-black'>{record.mat_description}</td>
                            <td className='border border-black'>{record.product_family}</td>
                        </tr>
                </tbody>
            </table>
            )
            } else if (record.account_id) {
                if (record.account_id === recordToDelete?.recordId)
                return (
                <table className='border border-black m-auto lg:text-base min-w-full text-sm'>
                <thead>
                <tr>
                     <th className='border border-black bg-red text-white'>Account ID</th>
                    <th className='border border-black bg-red text-white'>Customer Number</th>
                    <th className='border border-black bg-red text-white'>Account Name</th>
                    <th className='border border-black bg-red text-white'>Location</th>
                    <th className='border border-black bg-red text-white'>DSP</th>
                </tr>
                </thead>
                <tbody>
                        <tr key={i}>
                             <td className='border border-black text-center'>{record.account_id}</td>
                            <td className='border border-black text-center'>{record.customer_number}</td>
                            <td className='border border-black'>{record.account_name}</td>
                            <td className='border border-black'>{record.location}</td>
                            <td className='border border-black text-center'>{record.dsp}</td>
                        </tr>
                </tbody>
            </table>
            )
            }
        })}
        </div>
        <div className='w-[40%] flex justify-evenly'>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-red text-white px-4 rounded' onClick={handleSubmitDelete}>Yes</button>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-red text-white px-4 rounded' onClick={() => setToggleModal(false)}>No</button>
            </div>
        </div>
    </div>
  )
}

export default ModalForDelete

