"use client"

import React, { useState, useLayoutEffect, useMemo, useRef } from 'react'
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
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoPencil } from "react-icons/io5";
import {AiOutlineDownload, AiOutlineDelete, AiOutlineSortAscending, AiOutlineReload} from "react-icons/ai"
import { CiSearch, CiFilter } from "react-icons/ci";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
    Select, 
    Option,
    Checkbox,
    Alert,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

  const TABLE_HEAD = ["Order Date", "Delivery Date", "Customer Name", "Account Name", "Product", "Quantity", "Price", "Term", "Location", "DSP", "Freebies/Remarks/Concern", "Time Stamp", "Status", "", ""];
  
 
const BookingPage = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)

    const [isLoading, setIsLoading] = useState(true)
    const [errorInformation, setErrorInformation] = useState("")
    const [disableButton, setDisableButton] = useState(false)
    const [openAlert, setOpenAlert] = useState({
      status: false,
      message: ""
    })
    const [toggleModify, setToggleModify] = useState(false)
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);

    //handler for switching openDeleteDialogue
    const handleOpenDeleteDialogue = () => setOpenDeleteDialogue(!openDeleteDialogue)

    const [initialPendingOrderRecordsShown, setInitialPendingOrderRecordsShown] = useState([])
    const [pendingOrderRecordsShown, setPendingOrderRecordsShown] = useState([])
    const [selectedOrders, setSelectedOrders] = useState([])
    const [chosenFilter, setChosenFilter] = useState({
      label: "",
      function: null
    })
    const [setOfOrderIdsToDelete, setSetOfOrderIdsToDelete] = useState(new Set())

    //function for fetching records with a status of pending
    const fetchAllPendingOrders = async () => {
        setDisableButton(true)
        try {
            setIsLoading(true)
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/pending`)
            setInitialPendingOrderRecordsShown(data.data)
            setPendingOrderRecordsShown(data.data)
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


  //handler for filtering the order record base on DSP
  const handleFilterDSP = (e) => {
    e.preventDefault()
    const arrayOfFilteredDSP = initialPendingOrderRecordsShown.filter((order) => {
        return order.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setPendingOrderRecordsShown(arrayOfFilteredDSP)
}
 //handler for filtering the order record base on the location
 const handleFilterLocation = (e) => {
    e.preventDefault()
    const arrayOfFilteredLocation = initialPendingOrderRecordsShown.filter((order) => {
        return order.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setPendingOrderRecordsShown(arrayOfFilteredLocation)
}

//handler for filtering the order record base on the account name
const handleFilterAccountName = (e) => {
    e.preventDefault()
    const arrayOfFilteredAccountName = initialPendingOrderRecordsShown.filter((order) => {
        return order.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setPendingOrderRecordsShown(arrayOfFilteredAccountName)
}

//handler for filtering the order record by customer name
const handleFilterCustomerName = (e) => {
    e.preventDefault()
    const arrayOfFilteredCustomerName = initialPendingOrderRecordsShown.filter((order) => {
        return order.customer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setPendingOrderRecordsShown(arrayOfFilteredCustomerName)
}

 //handler for filtering order date
 const handleFilterByOrderDate = (e) => {
  e.preventDefault()
  const arrayOfFilteredOrderDate = initialPendingOrderRecordsShown.filter((order) => {
      return new Date(order.order_date).toDateString().toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
  })
  setPendingOrderRecordsShown(arrayOfFilteredOrderDate)
}

   //handler for choosing which to filter by
   const handleChooseFilterBy = (val) => {
    switch (val) {
      case "Date": setChosenFilter({label: "Date", function: handleFilterByOrderDate})
      break;
      case "DSP": setChosenFilter({label: "DSP", function: handleFilterDSP})
      break;
      case "Location": setChosenFilter({label: "Location", function: handleFilterLocation})
      break;
      case "Account Name": setChosenFilter({label: "Account Name", function: handleFilterAccountName})
      break;
      case "Customer Name": setChosenFilter({label: "Customer Name", function: handleFilterCustomerName})
    }
   }

    //handler for sorting based on location
    const handleSortByLocation = () => {
      let tempArr = [...pendingOrderRecordsShown]
      tempArr.sort((a, b) => {
          if(a.location < b.location) {
              return -1
          } 
          if(a.location > b.location) {
              return 1
          }
          return 0
      })
      setPendingOrderRecordsShown(tempArr)
  }

   //handler for sorting based on account name
   const handleSortByName = () => {
    let tempArr = [...pendingOrderRecordsShown]
    tempArr.sort((a, b) => {
        if(a.account_name < b.account_name) {
            return -1
        } 
        if(a.account_name > b.account_name) {
            return 1
        }
        return 0
    })
    setPendingOrderRecordsShown(tempArr)
}

  //handler for sorting the records by order date
  const handleSortByOrderDate = () => {
    let tempArr = [...pendingOrderRecordsShown]
    tempArr.sort((a,b) => Date.parse(b.order_date) - Date.parse(a.order_date))
    setPendingOrderRecordsShown(tempArr)
  }

    //handler for selecting orders to be invoiced
    const handleSelectedOrders = (e, orderObject) => {
      const {checked} = e.target;
      let updateSelectedOrders = [...selectedOrders]
      if (checked) {
          orderObject.order_id = Number(orderObject.order_id)
          updateSelectedOrders.push(orderObject)
          setOfOrderIdsToDelete.add(orderObject.order_id)
      } else {
        updateSelectedOrders = updateSelectedOrders.filter(({order_id}) => order_id !== Number(orderObject.order_id))
        setOfOrderIdsToDelete.delete(orderObject.order_id)
      }
      setSelectedOrders(updateSelectedOrders)
    }

    //handler for storing array of orders to be invoiced in the local storage
    const handleInvoiceData = () => {
      if (selectedOrders.length > 0) {
        const result = selectedOrders.every((order) => order.account_name === selectedOrders[0]?.account_name)
        if (result) {
          localStorage.removeItem("invoice")
          localStorage.setItem("invoice", JSON.stringify(selectedOrders))
          router.push("/invoice")
        } else {
          setOpenAlert({
            status: true,
            message: "Cannot proceed, different account names"
          })
          setTimeout(() => {
            setOpenAlert({
              status: false,
              message: ""
            })
          }, 3000)
        }
      } else {
        setOpenAlert({
          status: true,
          message: "Cannot proceed, Select booking/s to invoice."
        })
        setTimeout(() => {
          setOpenAlert({
            status: false,
            message: ""
          })
        }, 3000)
      }
    }

    //handler for deleting selected orders
    const handleDeleteSelectedOrders = async (e) => {
      setDisableButton(true)
      // try {
      //   await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`)
      // } catch (error) {
        
      // }
      let arrayOfOrdersToDelete = [...setOfOrderIdsToDelete]
      const filteredPendingOrders = pendingOrderRecordsShown.filter((order, index) => !setOfOrderIdsToDelete.has(order.order_id))
      setSelectedOrders([])
      setSetOfOrderIdsToDelete(new Set())
      setPendingOrderRecordsShown(filteredPendingOrders)
      handleOpenDeleteDialogue()
      setDisableButton(false)
    }

    //memoized function for displaying large list of orders
    const listOfBookings = useMemo(() => {
      return pendingOrderRecordsShown.map(
        (
          {
            order_id,
            order_date,
            account_id,
            product_id,
            customer_name,
            tin,
            contact,
            terms,
            remarks_freebies_concern,
            delivery_date,
            quantity,
            price,
            time_stamp,
            auth_id,
            status,
            customer_number,
            account_name,
            location,
            dsp,
            mat_code,
            mat_description,
            product_family,
            uom,
            stocks,                  
          },
          index,
        ) => {

          let pastOrderRecord = pendingOrderRecordsShown[index - 1]
          if (pastOrderRecord?.order_date === order_date && pastOrderRecord?.delivery_date === delivery_date && pastOrderRecord?.time_stamp === time_stamp) remarks_freebies_concern = null

          const isLast = index === pendingOrderRecordsShown.length - 1;
          const classes = isLast
            ? "p-4"
            : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={index}>
              <td className={classes}>
                <div className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="font-normal"> {new Date(order_date).toDateString()} </Typography>
                </div>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {new Date(delivery_date).toDateString()} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {customer_name} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {account_name} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {mat_description} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {quantity} </Typography> 
              </td>
              <td className={classes}>
                <Typography  variant="small" color="blue-gray" className="font-normal"> {price} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {terms} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {location} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {dsp} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {remarks_freebies_concern || ""} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {new Date(Number(time_stamp)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} </Typography>
              </td>
              <td className={classes}>
                <div className="w-max">
                  <Chip size="sm" variant="ghost" value={status} color={
                      status === "Approved"
                        ? "green"
                        : status === "Pending"
                        ? "amber"
                        : status === "Invoiced"
                        ? "blue"
                        : "red"
                    }/>
                </div>
              </td>
              {toggleModify && 
                <>
                  <td>
                    <Tooltip content="Select">
                        <Checkbox color="teal" checked={setOfOrderIdsToDelete.has(order_id)} onChange={(e) => handleSelectedOrders(e, {
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
                          })} className='h-5 w-5 border border-black'></Checkbox>
                    </Tooltip>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Edit User">
                      <IconButton variant="text">
                        <IoPencil className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </>
              }
            </tr>
          );
        },
      )
    }, [pendingOrderRecordsShown, toggleModify, selectedOrders, setOfOrderIdsToDelete])

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        fetchAllPendingOrders()
    },[])

    console.log(setOfOrderIdsToDelete)

  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <Card className="h-screen w-full rounded-none">
      <CardHeader floated={false} shadow={false} className="rounded-none h-auto overflow-visible">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Bookings
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the last transactions
            </Typography>
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
              color="orange"
            >
              {openAlert.message}
            </Alert>  
          </div>
          <div className='lg:flex justify-between'>
             <div className="w-full">
                <Select
                  label="Sort By"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  <Option onClick={handleSortByName}>Account Name</Option>
                  <Option onClick={handleSortByLocation}>Location</Option>
                  <Option onClick={handleSortByOrderDate}>Date</Option>
                </Select>
              </div>
             <div className="w-full">
                <Select
                  label="Filter By"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  value={chosenFilter.label}
                  onChange={handleChooseFilterBy}
                >
                  <Option value='Date'>Date :</Option>
                  <Option value='DSP'>DSP :</Option>
                  <Option value='Location'>Location :</Option>
                  <Option value='Account Name'>Account Name :</Option>
                  <Option value='Customer Name'>Customer Name :</Option>
                </Select>
              </div>
              <Input type='search' label={`Type ${chosenFilter.label}`} disabled={!chosenFilter.function} onChange={chosenFilter.function}></Input>
          </div>
          <div className="flex w-full justify-evenly shrink-0 gap-2 md:w-max">
            <Tooltip content="Reload">
              <IconButton variant="text">
                <AiOutlineReload className='h-6 w-6' disabled={disableButton} onClick={fetchAllPendingOrders}></AiOutlineReload>
              </IconButton>
            </Tooltip>
            <Tooltip content="Download">
              <IconButton variant="text">
                <ReactHTMLTableToExcel
                  id="export-pending-orders-button"
                  className="text-center cursor-pointer text-black p-1 shadow-2xl m-2 rounded"
                  table="export-pending-order-table"
                  filename="Pending Orders"
                  sheet="Bookings"
                  buttonText={<AiOutlineDownload className='h-7 w-7'></AiOutlineDownload>}
                />
              </IconButton>
            </Tooltip>
            <Button className="flex items-center gap-3 bg-black" size="sm" onClick={() => setToggleModify(!toggleModify)}>
               Modify
            </Button>
            <Button className="flex items-center gap-3" color="teal" size="sm" disabled={selectedOrders.length === 0} onClick={handleInvoiceData}>
               Invoice
            </Button>
            <Button onClick={handleOpenDeleteDialogue} variant="gradient" color="deep-orange" disabled={selectedOrders.length === 0}>
              Delete
            </Button>
            <Dialog open={openDeleteDialogue} handler={handleOpenDeleteDialogue}>
              <DialogHeader>Are you sure you want to delete the selected record/s ?</DialogHeader>
              <DialogBody>
                Selected record/s will be permanently removed from the database.
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="deep-orange"
                  onClick={handleOpenDeleteDialogue}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" disabled={disableButton} onClick={handleDeleteSelectedOrders}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0 py-0">
        <table id='export-pending-order-table' className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className={`${!toggleModify && head === "" && "hidden"} border-y border-blue-gray-100 bg-blue-gray-50/50 p-4`}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listOfBookings}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-end justify-between border-t border-blue-gray-50 p-2 md:p-6 mt-auto">
        <Button variant="outlined" size="sm" onClick={() => router.back()}>
            Previous
        </Button>
      </CardFooter>
    </Card>
    </>}</>
}</>
  )
}

export default BookingPage