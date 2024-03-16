"use client"

import React, { useRef, useState } from 'react'
import { Button, ButtonGroup, Typography, Card } from "@material-tailwind/react";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TABLE_HEAD = ["Product", "Price", "Quantity", ""];

const TABLE_ROWS = [
  {
    name: "John Michael michaelasdasdasdasdasdasdsaasdasdasdasdasdasooooooasddddddddddddddddddddoiiiiasdasdasdssssasdasdasdasdasds",
    job: "Manager",
    date: "23/04/18",
  },
  {
    name: "Alexa Liras",
    job: "Developer",
    date: "23/04/18",
  },
  {
    name: "Laurent Perrier",
    job: "Executive",
    date: "19/09/17",
  },
  {
    name: "Michael Levi",
    job: "Developer",
    date: "24/12/08",
  },
  {
    name: "Richard Gran",
    job: "Manager",
    date: "04/10/21",
  },
];

const Invoice = () => {

  const invoiceSection = useRef()

  const router = useRouter()

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
      // const pdfHeight = pdf.internal.pageSize.getHeight()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth / pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      // pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('downloaded-invoice.pdf')
    })
  }

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
          <Typography variant='h1'>Company Logo</Typography>
        </header>
        <main>
          <section className='flex mb-[5%]'>
            <div className='w-[50%] p-2 text-2xl'>
              <p>From</p>
              <Typography variant='h5'>Business Name</Typography>
              <p>Company Email</p>
              <p>Company Address</p>
              <p>Company Contact</p>
            </div>
            <div className='w-[50%] p-2 text-2xl'>
              <p>For</p>
              <Typography variant='h5'>Client Name</Typography>
              <p>Client Email</p>
              <p>Client Address</p>
              <p>Client Contact</p>
            </div>
          </section>
          <section className='p-2 mb-[5%] text-2xl'>
              <p>Number</p>
              <p>Date</p>
              <p>Terms</p>
              <p>Due</p>
          </section>
          <section>
          <Card className="h-full w-full rounded-none overflow-scroll lg:overflow-auto">
      <table className="w-full min-w-max table-auto lg:table-fixed text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
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
          {TABLE_ROWS.map(({ name, job, date }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4 w-[25%]" : "p-4 border-b border-blue-gray-50 w-[25%]";
 
            return (
              <tr key={name}>
                <td className={classes} >
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {job}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-normal w-[100%] break-all"
                  >
                    {date}
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