"use client"

import React, { useRef, useState, useLayoutEffect } from 'react'
import useStore from '@/stateManagement/store';
import { jwtDecode } from 'jwt-decode';
import { Button, ButtonGroup, Typography, Card } from "@material-tailwind/react";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TABLE_HEAD = ["Product", "Price", "Quantity", ""];

const Invoice = () => {

  const invoiceSection = useRef()

  const router = useRouter()

  const token = useStore((state) => state.token)

  const [invoiceOrders, setInvoiceOrders] = useState([])

  const getInvoiceOrdersFromLocalStorage = () => {
    if (!localStorage.getItem("invoice")) {
      router.back()
    } else {
      const ordersToInvoice = JSON.parse(localStorage.getItem("invoice"))
      setInvoiceOrders(ordersToInvoice)
    }
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
    <div className='w-full bg-white min-h-[86vh]'>
      <div className='flex items-center ml-3 lg:mx-[20%] mt-[1%]'>
        <button type='button' onClick={() => router.back()}>
          <FaArrowLeft className='w-7 h-7 text-black'></FaArrowLeft>
        </button>
      </div>
      <ButtonGroup className='flex justify-center p-5'>
        <Button className="gap-3 bg-gray flex items-center" size='md' onClick={handlePrintOfInvoice}>
            Print
            <FaPrint></FaPrint>
        </Button>
        <Button className="gap-3 bg-lightGreen flex items-center" size='md' onClick={handleDownloadOfInvoice}>
            Download
            <AiOutlineDownload className='text-xl'></AiOutlineDownload>
        </Button>
        <Button className="gap-3 bg-lightBlue flex items-center" size='md'>
            Send
            <AiOutlineSend className='text-xl'></AiOutlineSend>
        </Button>
      </ButtonGroup>
      <section className='lg:mx-[20%] p-3 bg-white mb-[2%]' ref={invoiceSection}>
        <header className='flex justify-between mb-[5%] lg:p-5'>
          <Typography variant='h1'>Invoice</Typography>
          <Typography variant='h1' className='break-all'>Company Logo</Typography>
        </header>
        <main>
          <section className='flex mb-[5%]'>
            <div className='w-[50%] p-2 text-2xl'>
              <p>From</p>
              <Typography variant='h5'>Western Brothers Oil And Lubricant Inc.</Typography>
              <p>Company Email</p>
              <p>Company Address</p>
              <p>Company Contact</p>
            </div>
            <div className='w-[50%] p-2 text-2xl'>
              <p>For</p>
              <Typography variant='h5'>{invoiceOrders[0]?.account_name || "Client Name"}</Typography>
              <p>Client Email</p>
              <p>Client Address</p>
              <p>Client Contact</p>
            </div>
          </section>
          <section className='p-2 mb-[5%] text-2xl'>
              <p>Number</p>
              <p>Date: {new Date(Date.now()).toDateString()}</p>
              <p>Terms: {invoiceOrders[0]?.terms || "N/A"}</p>
              <p>Due:</p>
          </section>
          <section>
          <Card className="h-full w-full rounded-none overflow-scroll sm:overflow-visible">
      <table className="w-full min-w-max table-auto sm:table-fixed text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={index}
                className="border-b border-blue-gray-100 bg-lightGreen p-4"
              >
                <Typography
                  variant="h4"
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
          {invoiceOrders.map(({ mat_description, price, quantity }, index) => {
            const isLast = index === invoiceOrders.length - 1;
            const classes = isLast ? "p-4 w-[25%]" : "p-4 border-b border-blue-gray-50 w-[25%]";
 
            return (
              <tr key={index}>
                <td className={classes} >
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {mat_description}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {price}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="lead"
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
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    Edit
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
          </section>
        </main>
      </section>
    </div>
  )
}

export default Invoice