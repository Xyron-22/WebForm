"use client"

import React, { useRef, useState, useLayoutEffect } from 'react'
import useStore from '@/stateManagement/store';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, ButtonGroup, Typography, Card, Alert, Input } from "@material-tailwind/react";
import { FaPrint, FaArrowLeft, FaCheck, FaRegEdit } from "react-icons/fa";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import DrawerNav from './DrawerNav';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactLoading from "react-loading";
import { MdArrowForwardIos } from "react-icons/md";

const Invoice = () => {

  const invoiceSection = useRef()

  const router = useRouter()

  const token = useStore((state) => state.token)
  const [isLoading, setIsLoading] = useState(true)
  const [errorInformation, setErrorInformation] = useState("")
  const [disableButton, setDisableButton] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)

  const [invoiceOrders, setInvoiceOrders] = useState([])
  const [invoiceInfoObject, setInvoiceInfoObject] = useState({
    date: new Date(Date.now()).toLocaleDateString(),
    account_name: "",
    tin: "",
    terms: "",
    location: "",
    osca_pwd_id_number: "",
    business_style: "",
    blank: ""
  })

  const [orderIdAndStatus, setOrderIdAndStatus] = useState()

  const [table_body, setTable_Body] = useState([
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
    {quantity: "", unit: "", mat_description: "", price: "", amount: ""}, 
  ])

  const [openAlert, setOpenAlert] = useState({
    status: false,
    message: "",
    color: "green"
  })

  const handleEditInvoice = (e) => {
    setInvoiceInfoObject({
      ...invoiceInfoObject,
      [e.target.name]: e.target.name === "date" ? new Date(e.target.value).toLocaleDateString() : e.target.value
    })
  }

  const handleEditUnit = (e, index) => {
    let tempTable_Body = [...table_body]
    tempTable_Body[index].unit = e.target.value
    setTable_Body(tempTable_Body)
  }

  const getInvoiceOrdersFromLocalStorage = () => {
    setDisableButton(true)
    setIsLoading(true)
    if (!localStorage.getItem("invoice")) {
      router.back()
    } else {
      const ordersToInvoice = JSON.parse(localStorage.getItem("invoice"))
      let total = 0
      const tempObjForOrderIdAndStatus = {
        order_id: [],
        status: "Invoiced"
      }
      let tempTable_Body = [...table_body]
      ordersToInvoice.map((order, index) => {
        total += (order.quantity * order.price)
        tempObjForOrderIdAndStatus.order_id.push(order.order_id)
        tempTable_Body.pop()
        tempTable_Body.unshift(order)
        if (index === ordersToInvoice.length - 1) {
          tempTable_Body.pop()
          tempTable_Body.push({
            mat_description: "",
            price: "",
            quantity: "",
            total: "PHP " + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          })
          const amountNetOfVAT = total / 1.12
          tempTable_Body.splice(14, 3, 
            {mat_description: "", price: "", quantity: "", total: total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')},
            {mat_description: "", price: "", quantity: "", total: (total - amountNetOfVAT).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')},
            {mat_description: "", price: "", quantity: "", total: amountNetOfVAT.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
          )
        } 
      })
      setInvoiceInfoObject({
        ...invoiceInfoObject,
        account_name: ordersToInvoice[0]?.account_name,
        tin: ordersToInvoice[0]?.tin,
        terms: ordersToInvoice[0]?.terms,
        location: ordersToInvoice[0]?.location,
      })
      setTable_Body(tempTable_Body)
      setInvoiceOrders(ordersToInvoice)
      setOrderIdAndStatus(tempObjForOrderIdAndStatus)
    }
    setDisableButton(false)
    setIsLoading(false)
  }

  //handler for confirming invoice
  const handleConfirmInvoice = async () => {
    setDisableButton(true)
    try {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`, orderIdAndStatus, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        setOpenAlert({
        status: true,
        message: "Invoice Successful",
        color: "green"
      })
      setTimeout(() => {
        setOpenAlert({
          ...openAlert,
          status: false,
          message: "",
        })
        router.push("/orders/invoiced")
      }, 1000)
    } catch (error) {
      if (error?.response?.data) {
        if (error.response.data.message === "jwt expired") {
          setOpenAlert({
            status: true,
            message: "Session expired, please login again",
            color: "orange"
          })
          setTimeout(() => {
            setOpenAlert({
              ...openAlert,
              status: false,
              message: ""
            })
            Cookies.remove("jwt")
            router.replace("/auth/login")
          }, 3000)
        } else {
          setErrorInformation(error.response.data)
        }
      } else {
        setErrorInformation({
            status: "failed",
            message: "Cannot connect to server..."
        })
      }
    }
    setDisableButton(false)
  }

  const handlePrintOfInvoice = useReactToPrint({
    content: () => invoiceSection.current,
  })

  const handleDownloadOfInvoice = () => {
    const input = invoiceSection.current
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('img/png')
      const pdf = new jsPDF('p', 'mm', 'a4', true)
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth / pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('downloaded-invoice.pdf')
    })
  }

  useLayoutEffect(() => {
    if (!token) return router.replace("/auth/login")
    const decodedToken = jwtDecode(token)
    if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
    if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
    getInvoiceOrdersFromLocalStorage()
  },[router, token])

  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <div className='w-full bg-white min-h-[86vh]'>
      <div className='flex flex-wrap flex-col items-center lg:mx-[20%] justify-center px-3 pt-2'>
        <Typography className='h-full text-center'>Print first before confirming.</Typography>
        <ButtonGroup className='flex justify-center flex-wrap'>
        <Button className="gap-3 bg-dark flex items-center rounded-none" size='md' disabled={toggleEdit} onClick={handlePrintOfInvoice}>
            Print
            <FaPrint></FaPrint>
        </Button>
        <Button className="gap-3 bg-dark flex items-center rounded-none" size='md' disabled={toggleEdit} onClick={handleDownloadOfInvoice}>
            Download
            <AiOutlineDownload className='text-xl'></AiOutlineDownload>
        </Button>
        <Button className="gap-3 bg-dark flex items-center rounded-none" size='md' onClick={() => setToggleEdit(!toggleEdit)}>
            Edit
            <FaRegEdit className='text-xl'></FaRegEdit>
        </Button>
        <Button className="gap-3 bg-lightGreen flex items-center rounded-none" size='md' disabled={disableButton || toggleEdit} onClick={handleConfirmInvoice}>
            Confirm
            <FaCheck className='text-xl'></FaCheck>
        </Button>
      </ButtonGroup>
      </div>
      <div className='absolute top-0 w-full flex justify-center'>
            <Alert
              open={openAlert.status}
              onClose={() => setOpenAlert({...openAlert, status: false})}
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              className="text-black w-auto z-20"
              color={openAlert.color}
            >
              {openAlert.message}
            </Alert>  
      </div>
      <section className='lg:mx-[20%] pl-[5.5%] pr-[3.5%] bg-white mb-[2%]' ref={invoiceSection}>
        <header className='w-full h-32'></header>
        <main>
          <section className={`flex flex-col w-full ${toggleEdit && "gap-2"}`}>
            <div className='w-full flex justify-between'>
              <Typography className={`font-semibold w-[60%] ${!toggleEdit && "text-transparent"}`}>SALES INVOICE</Typography>
              <div className='flex w-[40%]'>
                <div className='w-[60%] flex'>
                  <Typography className={!toggleEdit && "text-transparent"}>Date: </Typography>
                  {toggleEdit ? <Input type='date' label='Date' name='date' onChange={handleEditInvoice}></Input> : <Typography className='w-full text-center font-semibold'>{invoiceInfoObject.date}</Typography>}
                </div>
                <div className='w-[40%] flex'>
                  <Typography className="text-transparent">20</Typography>
                  <Typography className='w-full'></Typography>
                </div>
              </div>
            </div>
            <div className='w-full flex'>
              <Typography className={!toggleEdit && "text-transparent"}>Sold to: </Typography>
              {toggleEdit ? <Input type='text' label='Account Name' name='account_name' value={invoiceInfoObject.account_name} onChange={handleEditInvoice}></Input> : <Typography className='w-[90%] text-center uppercase font-semibold'>{invoiceInfoObject.account_name || "Client Name"}</Typography>}
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-[60%] flex'>
                <Typography className={!toggleEdit && "text-transparent"}>TIN: </Typography>
                {toggleEdit ? <Input type='text' label='TIN' name='tin' value={invoiceInfoObject.tin} onChange={handleEditInvoice}></Input> : <Typography className='w-full text-center font-semibold'>{invoiceInfoObject.tin}</Typography>}
              </div>
              <div className='w-[40%] flex'>
                <Typography className={!toggleEdit && "text-transparent"}>TERMS: </Typography>
                {toggleEdit ? <Input type='text' label='Terms' name='terms' value={invoiceInfoObject.terms} onChange={handleEditInvoice}></Input> : <Typography className='w-full text-center font-semibold'>{invoiceInfoObject.terms}</Typography>}
              </div>
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-[60%] flex'>
                <Typography className={!toggleEdit && "text-transparent"}>Address: </Typography>
                {toggleEdit ? <Input type='text' label='Address' name='location' value={invoiceInfoObject.location} onChange={handleEditInvoice}></Input> : <Typography className='w-full text-center font-semibold'>{invoiceInfoObject.location}</Typography>}
              </div>
              <div className='w-[40%] flex'>
                <Typography className={!toggleEdit && "text-transparent"}>OSCA/PWD ID No.: </Typography>
                {toggleEdit ? <Input type='text' label='OSCA/PWD ID No.' name='osca_pwd_id_number' value={invoiceInfoObject.osca_pwd_id_number} onChange={handleEditInvoice}></Input> : <Typography className='w-[45%] text-center font-semibold'>{invoiceInfoObject.osca_pwd_id_number}</Typography>}
              </div>
            </div>
            <div className='w-full flex justify-between'>
              <div className={`w-[60%] flex flex-col ${toggleEdit && "gap-2"}`}>
                {toggleEdit ? <Input type='text' name='blank' value={invoiceInfoObject.blank} onChange={handleEditInvoice}></Input> : <Typography className='w-full text-center font-semibold'>{invoiceInfoObject.blank}<span className='text-transparent'>.</span></Typography>}
                <div className='flex'>
                  <Typography className={!toggleEdit && "text-transparent"}>Business Style: </Typography>
                  {toggleEdit ? <Input type='text' label='Business Style' name='business_style' value={invoiceInfoObject.business_style} onChange={handleEditInvoice}></Input> : <Typography className='w-[70%] text-center font-semibold'>{invoiceInfoObject.business_style}</Typography>}
                </div>
              </div>
              <div className='w-[40%] flex'>
                <Typography className={!toggleEdit && "text-transparent"}>Cardholder&apos;s Signature: </Typography>
                <Typography className='w-full text-center font-semibold flex items-end'></Typography>
              </div>
            </div>
          </section>
          <table className={`w-full ${toggleEdit && "border"}`}>
              <thead>
                <tr className={!toggleEdit && "text-transparent"}>
                  <th className='w-[8%]'>Qty.</th>
                  <th className='w-[8%]'>Unit</th>
                  <th>DESCRIPTION</th>
                  <th className='w-[12%]'>Unit Price</th>
                  <th className='w-[15%]'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {table_body.map(({ mat_description, price, quantity, total, unit, amount}, index) => {
                  return (
                    <tr key={index} className={`text-center ${toggleEdit && "border"}`}>
                      <td className={toggleEdit && "border"}>{quantity}</td>
                      {toggleEdit ? <td className='border'><input type='text' name='unit' autoFocus={index === 0} value={unit} onChange={(e) => handleEditUnit(e, index)}></input></td> : <td>{unit || ""}</td>}
                      <td className={!mat_description && "text-transparent"}>{mat_description || "."}</td>
                      <td className={toggleEdit && "border"}>{price && Number(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                      <td>{total ? total : quantity && price ? (quantity * price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : amount}</td>
                    </tr>
                  )
                })}
              </tbody>
          </table>
        </main>
      </section>
      <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </div>
    </>}</>
}</>
  )
}

export default Invoice