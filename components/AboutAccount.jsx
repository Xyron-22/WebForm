"use client"

import React, { useState, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast, {Toaster} from "react-hot-toast";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import Link from 'next/link';
import { IoPencil } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
 
const TABLE_HEAD = ["Order Date", "Delivery Date", "Product", "Quantity", "Price", "Term", "Location", "DSP", "Freebies/Remarks/Concern", "Time Stamp", "Status", "", ""];
 
const AboutAccount = ({params}) => {
  
  const router = useRouter()
  const setOrdersForInvoice = useStore((state) => state.setOrdersForInvoice)
  const ordersForInvoice = useStore((state) => state.ordersForInvoice)

  const checkboxRef = useRef()

  const token = useStore((state) => state.token)

  const searchParams = useSearchParams()

  let queryStrings = {};

  searchParams.forEach((value, key) => {
    queryStrings[key] = value;
  });
 

  const [initialOrderRecordsShown, setInitialOrderRecordsShown] = useState([])

  const [ordersToApprove, setOrdersToApprove] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [errorInformation, setErrorInformation] = useState("")
  const [disableButton, setDisableButton] = useState(false)
 
  const fetchAccountOrders = async () => {
    setDisableButton(true)
    try {
      setIsLoading(true)
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/account/${params.accountId}`)
      let initialOrdersToApprove = []
      data.data.map(({order_id, order_date, delivery_date, customer_name, tin, terms, remarks_freebies_concern, quantity, price, account_name, location, mat_description, time_stamp}, i) => {
        if (order_date === queryStrings.order_date && time_stamp === queryStrings.time_stamp) {
          initialOrdersToApprove.push({
            order_id,
            order_date,
            delivery_date,
            customer_name,
            tin,
            terms,
            remarks_freebies_concern,
            quantity,
            price,
            account_name,
            location,
            mat_description,
            time_stamp
          })
        }
      })
      setOrdersToApprove(initialOrdersToApprove)  
      setInitialOrderRecordsShown(data.data)
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

  const handleOrdersToApprove = (e, orderObject) => {
    const {checked} = e.target;
    let updateOrdersToApprove = [...ordersToApprove]
    if (checked) {
        orderObject.order_id = Number(orderObject.order_id)
        updateOrdersToApprove.push(orderObject)
    } else {
        updateOrdersToApprove = updateOrdersToApprove.filter(({order_id}) => order_id !== Number(orderObject.order_id))
    }
    setOrdersToApprove(updateOrdersToApprove)
  }

 
  useLayoutEffect(() => {
    if (!token) return router.replace("/auth/login")
    const decodedToken = jwtDecode(token)
    if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
    if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
    fetchAccountOrders()
},[])
    
  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <Card className="h-full w-full my-4">
      <CardHeader floated={false} shadow={false} className="sticky top-0 m-0 bg-white z-[999] border-b rounded-none p-4">
        <div className="mb-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Recent Transactions
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the last transactions
            </Typography>
          </div>
          <div className='flex flex-col lg:flex-row md:gap-2'>
            <Typography color="gray" className="mt-1 font-normal">
              <span className='font-bold'>Credit Limit:</span> 256455644
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
            <span className='font-bold'>Price:</span> 58
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
            <span className='font-bold'>Balances:</span>
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
            <span className='font-bold'>Terms:</span>
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
            <span className='font-bold'>Inventory:</span> 12312
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<CiSearch className='h-5 w-5' />}
              />
            </div>
            <Button className="flex items-center gap-3 bg-black" size="sm">
              {/* <AiOutlineDownload strokeWidth={2} className='h-5 w-5'/>  */}
              Checkout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, i) => (
                <th
                  key={i}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialOrderRecordsShown.map(
              (
                {
                  order_id,
                  order_date,
                  delivery_date,
                  customer_name,
                  tin,
                  terms,
                  remarks_freebies_concern,
                  quantity,
                  price,
                  account_name,
                  location,
                  mat_description,
                  time_stamp,
                  dsp,
                  status
                },
                index,
              ) => {
                const isLast = index === initialOrderRecordsShown.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                let pastOrderRecord = initialOrderRecordsShown[index - 1]
                  if (pastOrderRecord?.order_date === order_date && pastOrderRecord?.delivery_date === delivery_date && pastOrderRecord?.time_stamp === time_stamp) remarks_freebies_concern = ""
                  
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                        >
                          {new Date(order_date).toDateString()}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {new Date(delivery_date).toDateString()}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {mat_description}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {quantity}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        &#x20B1;{price}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {terms}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {location}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {dsp}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="text-center font-normal"
                      >
                        {remarks_freebies_concern}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {new Date(Number(time_stamp)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={status}
                          color={
                            status === "Approved"
                              ? "green"
                              : status === "Pending"
                              ? "amber"
                              : "red"
                          }
                        />
                      </div>
                    </td>
                    <td className={classes} ref={checkboxRef}>
                      <Tooltip content="Select">
                          <input type='checkbox' className='h-5 w-5 cursor-pointer' defaultChecked={order_date === queryStrings.order_date} onChange={(e) => handleOrdersToApprove(e,
                            {
                              order_id,
                              order_date,
                              delivery_date,
                              customer_name,
                              tin,
                              terms,
                              remarks_freebies_concern,
                              quantity,
                              price,
                              account_name,
                              location,
                              mat_description,
                              time_stamp
                            }
                          )}></input>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text">
                          <IoPencil className='h-5 w-5'/>
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm">
          Previous
        </Button>
        <Button variant="outlined" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
    </>}</>
    }</>
  )
}

export default AboutAccount