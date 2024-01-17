"use client"

import React, { useState } from 'react';
import {MdClose} from "react-icons/md";
import axios from 'axios';
import toast from 'react-hot-toast';
import useStore from '@/stateManagement/store';

const ModalForEdit = ({setToggleModalForEdit, setProductRecordsShown, productRecordsShown, recordToEdit, setRecordToEdit}) => {

    const token = useStore((state) => state.token)

    const [disableButton, setDisableButton] = useState(false)

    const [productToEditStocks, setProductToEditStocks] = useState({
        product_id: recordToEdit.recordId,
        stocks: null
    })

    //function for sending product_id and data for updating number of stocks in product table
    const updateStocksInProductTable = async (e) => {
        e.preventDefault();
        setDisableButton(true)
        if (productToEditStocks.product_id && productToEditStocks.stocks) {
            try {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`, productToEditStocks, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                let tempArr = [...productRecordsShown]
                tempArr[recordToEdit.index].stocks = productToEditStocks.stocks
                setProductRecordsShown(tempArr)
                setToggleModalForEdit(false)
            } catch (error) {
                toast.error(error.response.data.message, {
                    duration: 3000,
                    className: "text-2xl"
                })
            }
        }
        setDisableButton(false)
    }

  return (
    <div className='bg-black bg-opacity-70 z-40 sticky bottom-0 w-full h-screen flex justify-center items-center'>
        <div className='w-full md:w-[60%] min-h-[40%] rounded-xl bg-white flex justify-center items-center flex-col z-50 relative'>
            <MdClose className='cursor-pointer absolute right-3 top-3 text-2xl' onClick={() => {
                setRecordToEdit({
                    recordId: null,
                    index: null
                })
                setToggleModalForEdit(false)
            }}/>
            <h1 className='m-3'>Edit number of stocks available for this record:</h1>
            <div className='overflow-auto w-[98%]'>
            {productRecordsShown.map(({product_id, mat_code, mat_description, product_family}, i) => {
                if(recordToEdit.recordId === product_id) {
                    return (
                        <table key={i} className='border border-black m-auto lg:text-base min-w-full text-sm'>
                    <thead>
                    <tr>
                        <th className='border border-black bg-red text-white'>Product ID</th>
                        <th className='border border-black bg-red text-white'>Material Code</th>
                        <th className='border border-black bg-red text-white'>Material Description</th>
                        <th className='border border-black bg-red text-white'>Product Family</th>
                    </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td className='border border-black text-center'>{product_id}</td>
                                <td className='border border-black'>{mat_code}</td>
                                <td className='border border-black'>{mat_description}</td>
                                <td className='border border-black'>{product_family}</td>
                            </tr>
                    </tbody>
                </table>
                    )
                }
            })}
            </div>
            <div className='w-full m-3'>
                <label htmlFor='stocks' className='text-lg md:text-2xl text-center'>Stocks: </label>
                <input className='rounded border border-black' placeholder='1' name='stocks' type='number' required onChange={(e) => setProductToEditStocks({...productToEditStocks, stocks: e.target.value})}></input>
            </div>
            <button disabled={disableButton} type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-[#008000] text-white p-1 rounded' onClick={updateStocksInProductTable}>UPDATE</button>
        </div>
    </div>
  )
}

export default ModalForEdit