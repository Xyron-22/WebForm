"use client"

import React, { useState, useLayoutEffect, useRef} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast, {Toaster} from "react-hot-toast";
import { useDownloadExcel } from 'react-export-table-to-excel';
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import Link from 'next/link';
import ModalForDelete from './ModalForDelete';
import {IoMdInformationCircleOutline} from "react-icons/io"
import {AiOutlineDownload} from "react-icons/ai"

const AccountRecord = ({data}) => {
    const router = useRouter()

    const tableRef = useRef(null)

    const token = useStore((state) => state.token)

    const [isLoading, setIsLoading] = useState(true)
    const [accountRecordsShown, setAccountRecordsShown] = useState(data.data)

    const [toggleModal, setToggleModal] = useState(false)

    const [recordToDelete, setRecordToDelete] = useState({
        recordId: null,
        table: "",
        index: null,
    })

    const [disableButton, setDisableButton] = useState(false)

    //function for filtering the account record base on DSP
    const handleFilterDSP = (e) => {
        e.preventDefault()
        const arrayOfRecordsFiltered = data.data.filter((account) => {
            return account.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfRecordsFiltered)
    }

    //function for filtering the account record base on the location
    const handleFilterLocation = (e) => {
        e.preventDefault()
        const arrayOfFilteredLocation = data.data.filter((account) => {
            return account.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredLocation)
    }
    
    //function for filtering the account record base on the account name
    const handleFilterAccountName = (e) => {
        e.preventDefault()
        const arrayOfFilteredAccountName = data.data.filter((account) => {
            return account.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredAccountName)
    }
 
    //function for fetching all and latest account records
    const fetchAllAccountRecords = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        try {
            setIsLoading(true)
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account`)
            setAccountRecordsShown(data.data)
            setIsLoading(false)
            setDisableButton(false)
        } catch (error) {
            setDisableButton(false)
            toast.error("Error occurred, please try again", {
                duration: 3000,
                className: "text-2xl"
            })
        }
    }

    //function for sorting the records by account name
    const handleSortByName = () => {
        let tempArr = [...accountRecordsShown]
        tempArr.sort((a, b) => {
            if(a.account_name.trim() < b.account_name.trim()) { //trim the account name first so it can be sort correctly
                return -1
            } 
            if(a.account_name.trim() > b.account_name.trim()) {
                return 1
            }
            return 0
        })
        setAccountRecordsShown(tempArr)
    }

    //function for sorting the records by location
    const handleSortByLocation = () => {
        let tempArr = [...accountRecordsShown]
        tempArr.sort((a, b) => {
            if(a.location < b.location) {
                return -1
            } 
            if(a.location > b.location) {
                return 1
            }
            return 0
        })
        setAccountRecordsShown(tempArr)
    }


    const {onDownload} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Account Records Table",
        sheet: "Accounts"
    })

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        setIsLoading(false)
    },[])

  return (
    <>{data.status === "failed" || data.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{data.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <div className={`bg-white text-center w-full ${toggleModal ? "p-0" : "xl:w-[90%] my-5 p-2"} md:text-xl relative z-[999999999999]`}>
    <Link href={"/"} className='absolute left-3 bg-blue text-white p-1 m-1 rounded'>Home</Link>
       <h1 className='md:text-3xl font-bold mx-3 mb-2'>Account Records</h1>
       <h1>Number of records: {accountRecordsShown.length}</h1>
       <button type='button' onClick={onDownload} className='text-center cursor-pointer bg-blue text-white p-1 shadow-2xl m-2 rounded'>Download Table<AiOutlineDownload className='mx-1 inline'></AiOutlineDownload></button>
       <div className='flex w-full justify-center items-center'>
        <IoMdInformationCircleOutline className='text-red'></IoMdInformationCircleOutline>
        <p>Click a record to delete</p>
        </div>
       <hr></hr>
       <input type='button' value={"Reload"} disabled={disableButton} onClick={fetchAllAccountRecords} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
       <input type='search' placeholder='Search DSP' onChange={handleFilterDSP} className='text-center border border-black m-2'></input>
       <input type='search' name='filterLocation' placeholder='Search Location' onChange={handleFilterLocation} className='text-center border border-black m-2'></input>
       <input type='search' name='filterAccountName' placeholder='Search Account Name' onChange={handleFilterAccountName} className='text-center border border-black m-2'></input>
       <input type='button' name='sortByName' value={"Sort by Account name"} onClick={handleSortByName} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
       <input type='button' name='sortByLocation' value={"Sort by Location"} onClick={handleSortByLocation} className='m-2 cursor-pointer bg-blue text-white p-1 shadow-2xl rounded'></input>
       <div className='w-full overflow-auto'>
       <table className='border border-black sm:min-w-full m-auto' ref={tableRef}>
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
               {accountRecordsShown.map(({account_id, customer_number, account_name, location, dsp}, i) => {
                   return (
                       <tr key={i} className='cursor-pointer' onClick={() => {
                        setRecordToDelete({
                            recordId: account_id,
                            table: "account",
                            index: i
                        })
                        setToggleModal(true)
                       }}>
                        <td className='border border-black text-center'>{account_id}</td>
                       <td className='border border-black text-center'>{customer_number}</td>
                       <td className='border border-black'>{account_name}</td>
                       <td className='border border-black'>{location}</td>
                       <td className='border border-black text-center'>{dsp}</td>
                   </tr>
                   )
               })}
           </tbody>
       </table>
       </div>
       {toggleModal && <ModalForDelete setToggleModal={setToggleModal} recordToDelete={recordToDelete} arrayOfRecordsShown={accountRecordsShown} setArrayOfRecordsShown={setAccountRecordsShown}></ModalForDelete>}
   </div>
   <Toaster></Toaster>
   </>}</>
    }</> 
  )
}

export default AccountRecord