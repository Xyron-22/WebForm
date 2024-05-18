"use client"

import React, { useRef, useState, useLayoutEffect } from 'react'
import useStore from '@/stateManagement/store';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, ButtonGroup, Typography, Card, Alert } from "@material-tailwind/react";
import { FaPrint, FaArrowLeft, FaCheck } from "react-icons/fa";
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

  const [invoiceOrders, setInvoiceOrders] = useState([])

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
            total: "Bill: " + total
          })
          const amountNetOfVAT = total / 1.12
          tempTable_Body.splice(14, 3, 
            {mat_description: "", price: "", quantity: "", total: Number(total.toFixed(2))},
            {mat_description: "", price: "", quantity: "", total: Number((total - amountNetOfVAT).toFixed(2))},
            {mat_description: "", price: "", quantity: "", total: Number(amountNetOfVAT.toFixed(2))}
          )
        } 
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
  },[])

  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <div className='w-full bg-white min-h-[86vh]'>
      <div className='flex flex-wrap flex-col items-center lg:mx-[20%] justify-center px-3 pt-2'>
        <Typography className='h-full text-center'>Print first before confirming.</Typography>
        <ButtonGroup className='flex justify-center flex-wrap'>
        <Button className="gap-3 bg-gray flex items-center rounded-none" size='md' onClick={handlePrintOfInvoice}>
            Print
            <FaPrint></FaPrint>
        </Button>
        <Button className="gap-3 bg-lightBlue flex items-center rounded-none" size='md' onClick={handleDownloadOfInvoice}>
            Download
            <AiOutlineDownload className='text-xl'></AiOutlineDownload>
        </Button>
        <Button className="gap-3 bg-lightGreen flex items-center rounded-none" size='md' disabled={disableButton} onClick={handleConfirmInvoice}>
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
          <section className='flex flex-col w-full'>
            <div className='w-full flex justify-between'>
              <Typography className='font-semibold w-[60%]'>SALES INVOICE</Typography>
              <div className='flex w-[40%]'>
                <div className='w-[60%] flex'>
                  <Typography>Date: </Typography>
                  <Typography className='w-full text-center font-semibold'>{new Date(Date.now()).toLocaleDateString()}</Typography>,
                </div>
                <div className='w-[40%] flex'>
                  <Typography className='w-[40%]'>20</Typography>
                  <Typography className='w-full'></Typography>
                </div>
              </div>
            </div>
            <div className='w-full flex'>
              <Typography>Sold to: </Typography>
              <Typography className='w-[90%] text-center uppercase font-semibold'>{invoiceOrders[0]?.account_name || "Client Name"}</Typography>
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-[60%] flex'>
                <Typography>TIN: </Typography>
                <Typography className='w-full text-center font-semibold'>Test Tin</Typography>
              </div>
              <div className='w-[40%] flex'>
                <Typography>TERMS: </Typography>
                <Typography className='w-full text-center font-semibold'>45 Days</Typography>
              </div>
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-[60%] flex'>
                <Typography>Address: </Typography>
                <Typography className='w-full text-center font-semibold'>Test Address</Typography>
              </div>
              <div className='w-[40%] flex'>
                <Typography>OSCA/PWD ID No.: </Typography>
                <Typography className='w-[45%] text-center font-semibold'>12345222</Typography>
              </div>
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-[60%] flex flex-col'>
                <Typography className='w-full text-center font-semibold'>Test Text</Typography>
                <div className='flex'>
                  <Typography>Business Style: </Typography>
                  <Typography className='w-[70%] text-center font-semibold'>Test Business Style</Typography>
                </div>
              </div>
              <div className='w-[40%] flex'>
                <Typography>Cardholder's Signature: </Typography>
                <Typography className='w-full text-center font-semibold flex items-end'>Test Signature</Typography>
              </div>
            </div>
          </section>
          <table className='w-full border border-black'>
              <thead className='border border-black'>
                <tr>
                  <th className='border border-black w-[8%]'>Qty.</th>
                  <th className='border border-black w-[8%]'>Unit</th>
                  <th className='border border-black'>DESCRIPTION</th>
                  <th className='border border-black w-[12%]'>Unit Price</th>
                  <th className='border border-black w-[15%]'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {table_body.map(({ mat_description, price, quantity, total, unit, amount}, index) => {
                  return (
                    <tr key={index} className='text-center'>
                      <td className='border border-black'>{quantity}</td>
                      <td className='border border-black'>{unit || ""}</td>
                      <td className='border border-black'>{mat_description}.</td>
                      <td className='border border-black'>{price}</td>
                      <td className='border border-black'>{total ? total : quantity * price ? quantity * price : amount}</td>
                    </tr>
                  )
                })}
              </tbody>
          </table>
          {/* <section>
          <Card className="h-full w-full rounded-none overflow-scroll sm:overflow-visible">
      <table className="w-full min-w-max table-auto sm:table-fixed text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={index}
                className="-b -blue-gray-100 bg-lightGreen p-4"
              >
                <Typography
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 w-[25%]"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoiceOrders.map(({ mat_description, price, quantity, total}, index) => {
            const isLast = index === invoiceOrders.length - 1;
            const classes = isLast ? "p-4 w-[25%]" : "p-4 -b -blue-gray-50 w-[25%]";
 
            return (
              <tr key={index}>
                <td className={classes} >
                  <Typography
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {mat_description}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {price}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {quantity}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {total ? total : price * quantity}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
          </section> */}
        </main>
      </section>
      <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </div>
    </>}</>
}</>
  )
}

export default Invoice