"use client"

import React from 'react'
import axios from "axios"
import toast, {Toaster} from 'react-hot-toast'

const ModalForDelete = ({setToggleModal, recordToDelete, arrayOfRecords, setArrayOfRecords}) => {
    
    //create a function for sending a delete method
    //this component functionalities is not finished yet, goal is to make this component reusable in different routes
    const handleSubmitDelete = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/${recordToDelete?.table}/${recordToDelete?.recordId}`)
            toast.success("Record deleted", {
                duration: 3000,
                className: "text-2xl"
            })
            let tempArr = [...arrayOfRecords]
            const newArr = tempArr.filter((record) => {
                return record.order_id || record.product_id || record.account_id !== recordToDelete?.recordId
            })
            setArrayOfRecords(newArr)
            setToggleModal(false)
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
        <h1>{recordToDelete?.recordId}{recordToDelete?.table}</h1>
        <div className='w-[40%] flex justify-evenly'>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-red text-white p-1 rounded' onClick={handleSubmitDelete}>Yes</button>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-red text-white p-1 rounded' onClick={() => setToggleModal(false)}>No</button>
            </div>
        </div>
        <Toaster></Toaster>
    </div>
  )
}

export default ModalForDelete