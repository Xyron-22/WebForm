"use client"

import React, { useState, useLayoutEffect, useMemo } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import { IoPencil } from "react-icons/io5";
import {AiOutlineDownload, AiOutlineReload} from "react-icons/ai"
import { MdArrowForwardIos } from "react-icons/md";
import DrawerNav from './DrawerNav';
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
  
 
const OrderRecord = () => {
 
    const router = useRouter()

    const token = useStore((state) => state.token)

    const [decodedJWTToken, setDecodedJWTToken] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [errorInformation, setErrorInformation] = useState("")
    const [disableButton, setDisableButton] = useState(false)
    const [openAlert, setOpenAlert] = useState({
      status: false,
      message: "",
      color: "green"
    })
    let timeOut;
    const [toggleModify, setToggleModify] = useState(false)
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
    const [openEditDialogue, setOpenEditDialogue] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)

    const [paginated, setPaginated] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const numberOfItemsPerPage = 100
    

    //handler for switching openDeleteDialogue
    const handleOpenDeleteDialogue = () => setOpenDeleteDialogue(!openDeleteDialogue)
    //handler for switching openEditDialogue
    const handleOpenEditDialogue = () => {
      setOpenEditDialogue(!openEditDialogue)
      setOrderToEdit({})
    }

    const [initialOrderRecordsShown, setInitialOrderRecordsShown] = useState([])
    const [orderRecordsShown, setOrderRecordsShown] = useState([])
    const [chosenFilter, setChosenFilter] = useState({
      label: "",
      function: null
    })
    const [setOfOrderIdsToDelete, setSetOfOrderIdsToDelete] = useState(new Set())
    const [orderToEdit, setOrderToEdit] = useState({})

    //handler for editing order object to edit
    const handleSetOrderToEdit = (e) => {
      setOrderToEdit({...orderToEdit, [e.target.name]: e.target.name === "quantity" || e.target.name === "price" ? Number(e.target.value) : e.target.value})
    }

    //function for fetching all order records
    const fetchAllOrders = async (e, decodedToken) => {
        setDisableButton(true)
        try {
            setIsLoading(true)
            // 
            let response;
            if (decodedToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) {
                const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`)
                response = data
            } else {
                const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/${decodedToken.id}`)
                response = data
            }
            if (paginated) {
              const arrayOfOrdersInPage = response.data.filter((order, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
              setOrderRecordsShown(arrayOfOrdersInPage)
            } else {
              setOrderRecordsShown(response.data)
            }
            setInitialOrderRecordsShown(response.data)
            setIsLoading(false) 
        } catch (error) {
          if (error?.response?.data) {
            if (error.response.data.message === "jwt expired") {
              clearTimeout(timeOut)
              setOpenAlert({
                status: true,
                message: "Session expired, please login again",
                color: "orange"
              })
              timeOut = setTimeout(() => {
                setOpenAlert({
                    ...openAlert,
                  status: false,
                  message: "",
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

    //handler for switching what is shown, either paginated or all of the order records
    const handleSwitchPagination = () => {
      if (paginated) {
        setToggleModify(false)
        setOrderRecordsShown(initialOrderRecordsShown)
        setPaginated(false)
      } else {
        const arrayOfOrdersInPage = initialOrderRecordsShown.filter((order, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
        setOrderRecordsShown(arrayOfOrdersInPage)
        setPaginated(true)
      }
      setChosenFilter({
        label: "",
        function: null
      })
    }

  //handler for filtering the order record base on DSP
  const handleFilterDSP = (e) => {
    e.preventDefault()
    if (paginated) {
      const arrayOfFilteredDSP = orderRecordsShown.filter((order) => {
        return order.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredDSP) 
    } else {
      const arrayOfFilteredDSP = initialOrderRecordsShown.filter((order) => {
        return order.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredDSP)
    }
  }
 //handler for filtering the order record base on the location
 const handleFilterLocation = (e) => {
    e.preventDefault()
    if (paginated) {
      const arrayOfFilteredLocation = orderRecordsShown.filter((order) => {
        return order.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredLocation)
    } else {
      const arrayOfFilteredLocation = initialOrderRecordsShown.filter((order) => {
        return order.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredLocation)
    }
  }

//handler for filtering the order record base on the account name
const handleFilterAccountName = (e) => {
    e.preventDefault()
    if (paginated) {
      const arrayOfFilteredAccountName = orderRecordsShown.filter((order) => {
        return order.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredAccountName)
    } else {
      const arrayOfFilteredAccountName = initialOrderRecordsShown.filter((order) => {
        return order.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredAccountName)
    }
  }

//handler for filtering the order record by customer name
const handleFilterCustomerName = (e) => {
    e.preventDefault()
    if (paginated) {
      const arrayOfFilteredCustomerName = orderRecordsShown.filter((order) => {
        return order.customer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredCustomerName)
    } else {
      const arrayOfFilteredCustomerName = initialOrderRecordsShown.filter((order) => {
        return order.customer_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      })
      setOrderRecordsShown(arrayOfFilteredCustomerName)
    }
}

 //handler for filtering order date
 const handleFilterByOrderDate = (e) => {
  e.preventDefault()
  if (paginated) {
    const arrayOfFilteredOrderDate = orderRecordsShown.filter((order) => {
      return new Date(order.order_date).toDateString().toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setOrderRecordsShown(arrayOfFilteredOrderDate)
  } else {
    const arrayOfFilteredOrderDate = initialOrderRecordsShown.filter((order) => {
      return new Date(order.order_date).toDateString().toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    })
    setOrderRecordsShown(arrayOfFilteredOrderDate)
  }
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
      let tempArr = [...orderRecordsShown]
      tempArr.sort((a, b) => {
          if(a.location.trim() < b.location.trim()) {
              return -1
          } 
          if(a.location.trim() > b.location.trim()) {
              return 1
          }
          return 0
      })
      setOrderRecordsShown(tempArr)
  }

   //handler for sorting based on account name
   const handleSortByName = () => {
    let tempArr = [...orderRecordsShown]
    tempArr.sort((a, b) => {
        if(a.account_name.trim() < b.account_name.trim()) {
            return -1
        } 
        if(a.account_name.trim() > b.account_name.trim()) {
            return 1
        }
        return 0
    })
    setOrderRecordsShown(tempArr)
}

  //handler for sorting the records by order date
  const handleSortByOrderDate = () => {
    let tempArr = [...orderRecordsShown]
    tempArr.sort((a,b) => Date.parse(b.order_date.trim()) - Date.parse(a.order_date.trim()))
    setOrderRecordsShown(tempArr)
  }

    //handler for selecting orders to be deleted
    const handleSelectedOrders = (e, orderObject) => {
      const {checked} = e.target;
      const tempSet = new Set([...setOfOrderIdsToDelete])
      if (checked) {
        tempSet.add(orderObject.order_id)
      } else {
        tempSet.delete(orderObject.order_id)
      }
      setSetOfOrderIdsToDelete(tempSet)
    }

    //handler for deleting selected orders
    const handleDeleteSelectedOrders = async (e) => {
      setDisableButton(true)
      try {
        const arrayOfOrdersToDelete = [...setOfOrderIdsToDelete]
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/selected`, {
          data: {data: arrayOfOrdersToDelete},
          headers: {
              "Authorization": `Bearer ${token}`
          },
        })
        const filteredOrders = orderRecordsShown.filter((order, index) => !setOfOrderIdsToDelete.has(order.order_id))
        const filteredInitialOrdersShown = initialOrderRecordsShown.filter((order, index) => !setOfOrderIdsToDelete.has(order.order_id))
        setSetOfOrderIdsToDelete(new Set())
        setOrderRecordsShown(filteredOrders)
        setInitialOrderRecordsShown(filteredInitialOrdersShown)
        handleOpenDeleteDialogue()
        clearTimeout(timeOut)
        setOpenAlert({
            status: true,
            message: "Delete Successful",
            color: "green"
          })
          timeOut = setTimeout(() => {
            setOpenAlert({
              ...openAlert,
              status: false,
              message: ""
            })
          }, 1000)
      } catch (error) {
        clearTimeout(timeOut)
        setOpenAlert({
          status: true,
          message: "Something went wrong.",
          color: "orange"
        })
        timeOut = setTimeout(() => {
          setOpenAlert({
            ...openAlert,
            status: false,
            message: ""
          })
        }, 3000)
      }
      setDisableButton(false)
    }

    //handler for editing an order
    const handleUpdateOrder = async () => {
      setDisableButton(true)
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/${orderToEdit.order_id}`, orderToEdit, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        let updatedArrayOfOrders = [...orderRecordsShown]
        let order = updatedArrayOfOrders[orderToEdit.index]
        order.order_date = orderToEdit.order_date
        order.delivery_date = orderToEdit.delivery_date
        order.customer_name = orderToEdit.customer_name
        order.quantity = orderToEdit.quantity
        order.price = orderToEdit.price
        order.terms = orderToEdit.terms
        order.remarks_freebies_concern = orderToEdit.remarks_freebies_concern
        setOrderRecordsShown(updatedArrayOfOrders)
        setOrderToEdit({})
        setOpenEditDialogue(!openEditDialogue)
        clearTimeout(timeOut)
        setOpenAlert({
            status: true,
            message: "Update Successful",
            color: "green"
          })
          timeOut = setTimeout(() => {
            setOpenAlert({
              ...openAlert,
              status: false,
              message: ""
            })
          }, 1000)
      } catch (error) {
        if (error?.response?.data) {
          setOpenEditDialogue(!openEditDialogue)
          if (error.response.data.message === "jwt expired") {
            clearTimeout(timeOut)
            setOpenAlert({
              status: true,
              message: "Session expired, please login again",
              color: "orange"
            })
            timeOut = setTimeout(() => {
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

    //memoized function for displaying large list of orders
    const listOfOrderRecords = useMemo(() => {
      return orderRecordsShown.map(
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

          let pastOrderRecord = orderRecordsShown[index - 1]
          if (pastOrderRecord?.order_date === order_date && pastOrderRecord?.delivery_date === delivery_date && new Date(Number(pastOrderRecord?.time_stamp)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}) === new Date(Number(time_stamp)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})) remarks_freebies_concern = null

          const isLast = index === orderRecordsShown.length - 1;
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
                      status === "Paid"
                        ? "green"
                        : status === "Pending"
                        ? "amber"
                        : status === "Invoiced"
                        ? "teal"
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
                  {status === "Invoiced" || status === "Paid" ? decodedJWTToken.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE ? 
                <td className={classes} onClick={() => {
                    setOpenEditDialogue(!openEditDialogue)
                    setOrderToEdit({
                      order_id,
                      order_date: new Date(order_date).toLocaleDateString('sv-SE'),
                      delivery_date: new Date(delivery_date).toLocaleDateString('sv-SE'),
                      customer_name,
                      quantity,
                      price,
                      terms,
                      remarks_freebies_concern,
                      index
                    })
                    }}>
                    <Tooltip content="Edit">
                        <IconButton variant="text">
                            <IoPencil className="h-5 w-5"/>
                        </IconButton>
                    </Tooltip>
                </td> : <td></td> 
                : <td className={classes} onClick={() => {
                    setOpenEditDialogue(() => !openEditDialogue)
                    setOrderToEdit({
                      order_id,
                      order_date: new Date(order_date).toLocaleDateString('sv-SE'),
                      delivery_date: new Date(delivery_date).toLocaleDateString('sv-SE'),
                      customer_name,
                      quantity,
                      price,
                      terms,
                      remarks_freebies_concern,
                      index
                    })
                    }}>
                    <Tooltip content="Edit">
                        <IconButton variant="text">
                            <IoPencil className="h-5 w-5"/>
                        </IconButton>
                    </Tooltip>
                    </td>}
                </>
              }
            </tr>
          );
        },
      )
    }, [orderRecordsShown, toggleModify, setOfOrderIdsToDelete, decodedJWTToken.role, handleSelectedOrders, openEditDialogue])

    //function for the page buttons
    const getItemProps = (page) =>
    ({
      className: page === currentPage ? "bg-light font-bold" : "text-black font-bold bg-gray bg-opacity-30",
      onClick: () => {
        setCurrentPage(page)
        const arrayOfOrdersInPage = initialOrderRecordsShown.filter((order, index) => index < (numberOfItemsPerPage * page) && index >= numberOfItemsPerPage * (page - 1))
        setOrderRecordsShown(arrayOfOrdersInPage)
      },
    });
 
    const next = () => {
      if (currentPage === Math.ceil(initialOrderRecordsShown.length / numberOfItemsPerPage)) return;
      const arrayOfOrdersInPage = initialOrderRecordsShown.filter((order, index) => index < numberOfItemsPerPage * (currentPage + 1) && index >= numberOfItemsPerPage * currentPage)
      setOrderRecordsShown(arrayOfOrdersInPage)
      setCurrentPage(currentPage + 1);
    };
 
    const prev = () => {
      if (currentPage <= 1) return;
      const arrayOfOrdersInPage = initialOrderRecordsShown.filter((order, index) => index < numberOfItemsPerPage * (currentPage - 1) && index >= numberOfItemsPerPage * (currentPage - 2))
      setOrderRecordsShown(arrayOfOrdersInPage)
      setCurrentPage(currentPage - 1);
    };

    //function for returning numbers of page to show in pagination
    const numberOfPagesToShow = useMemo(() => {
      const totalNumberOfPages = Math.ceil(initialOrderRecordsShown.length / numberOfItemsPerPage)
      let arrayOfNumbers = []
      for (let i = 1; i <= totalNumberOfPages; i++) {
        arrayOfNumbers.push(i)
      }
      return arrayOfNumbers.map((page, index) => {
          return (
            <div key={index} className="flex items-center gap-2 mx-1">
              <IconButton {...getItemProps(page)}>{page}</IconButton>
            </div>
          )
      })
    }, [initialOrderRecordsShown, currentPage, getItemProps])

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        setDecodedJWTToken(decodedToken)
        fetchAllOrders(null, decodedToken)
    },[fetchAllOrders, router, token])

  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <Card className="h-screen w-full rounded-none">
      <CardHeader floated={false} shadow={false} className="rounded-none h-auto overflow-visible">
        <div className="mb-4 flex flex-col justify-between md:flex-row md:items-start">
          <div>
            <Typography variant="h5" color="blue-gray">
              <Button color='blue-gray' className='p-2 mr-1 rounded-full text-white' onClick={() => setOpenDrawer(true)}>
                <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
              </Button>   
                All Orders
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the transactions
            </Typography>
          </div>
          <div className='absolute top-0 w-full flex justify-center'>
            <Alert
              open={openAlert.status}
              onClose={() => {
                clearTimeout(timeOut)
                setOpenAlert({...openAlert, status: false})
              }}
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
          <div className='xl:flex flex-row'>
             <div className='w-full'>
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
             <div className='w-full'>
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
          <div className="flex w-full flex-wrap justify-evenly shrink-0 gap-2 md:w-[50%] lg:w-max">
            <Tooltip content="Reload">
              <IconButton variant="text">
                <AiOutlineReload className='h-6 w-6' disabled={disableButton} onClick={(e) => fetchAllOrders(e, decodedJWTToken)}></AiOutlineReload>
              </IconButton>
            </Tooltip>
            <Tooltip content="Download">
              <IconButton variant="text">
                <ReactHTMLTableToExcel
                  id="export-orders-button"
                  className="text-center cursor-pointer text-black p-1 shadow-2xl m-2 rounded"
                  table="export-order-table"
                  filename="All Orders"
                  sheet="Orders"
                  buttonText={<AiOutlineDownload className='h-7 w-7'></AiOutlineDownload>}
                />
              </IconButton>
            </Tooltip>
            <Button color='blue-gray' className="flex items-center gap-3" size="sm" onClick={handleSwitchPagination}>
               {paginated ? "Show All" : "Paginate"}
            </Button>
            <Button color='blue-gray' className="flex items-center gap-3" size="sm" disabled={!paginated} onClick={() => setToggleModify(!toggleModify)}>
              Select
            </Button>
            <Button onClick={handleOpenDeleteDialogue} variant="gradient" color="deep-orange" disabled={setOfOrderIdsToDelete.size === 0}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0 py-0">
        <table id='export-order-table' className="w-full min-w-max table-auto text-left">
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
            {listOfOrderRecords}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-end justify-between border-t border-blue-gray-50 p-2 md:p-6 mt-auto">
        {paginated && <>
          <Button className='my-auto' variant="outlined" size="sm" onClick={prev}>
            Previous
        </Button>
        <div className='flex overflow-auto justify-evenly w-auto mx-1 border rounded-lg py-1 border-gray'>
          {numberOfPagesToShow}
        </div>
        <Button className='my-auto' variant="outlined" size="sm" onClick={next}>
            Next
        </Button>
        </>}
      </CardFooter>
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
            <Dialog open={openEditDialogue} handler={handleOpenEditDialogue}>
              <DialogHeader>Editing...</DialogHeader>
              <DialogBody>
                <Typography className='mb-5'>Only edit inputs needed to be updated</Typography>
                <Input type='date' name='order_date' label={"Order Date: " + new Date(orderToEdit?.order_date).toDateString()} value={orderToEdit?.order_date} onChange={handleSetOrderToEdit}></Input>
                <Input type='date' name='delivery_date' label={"Delivery Date: " + new Date(orderToEdit?.delivery_date).toDateString()} value={orderToEdit?.delivery_date} onChange={handleSetOrderToEdit}></Input>
                <Input type='text' name='customer_name' label='Customer Name' placeholder={orderToEdit?.customer_name} onChange={handleSetOrderToEdit}></Input>
                <Input type='number' name='quantity' label='Quantity' placeholder={orderToEdit?.quantity} onChange={handleSetOrderToEdit}></Input>
                <Input type='number' name='price' label='Price' placeholder={orderToEdit?.price} onChange={handleSetOrderToEdit}></Input>
                <Input type='text' name='terms' label='Term' placeholder={orderToEdit?.terms} onChange={handleSetOrderToEdit}></Input>
                <Input type='text' name='remarks_freebies_concern' label='Freebies/Remarks/Concern' placeholder={orderToEdit?.remarks_freebies_concern} onChange={handleSetOrderToEdit}></Input>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="deep-orange"
                  onClick={handleOpenEditDialogue}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" disabled={disableButton} onClick={handleUpdateOrder}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
            <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </Card>
    </>}</>
}</>
  )
}

export default OrderRecord