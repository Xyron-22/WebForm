"use client"

import React, { useState, useLayoutEffect, useMemo } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
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

  const TABLE_HEAD = ["Customer Number", "Account Name", "Location", "DSP", ""];
  
 
const AccountRecord = () => {
 
    const router = useRouter()

    const token = useStore((state) => state.token)

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
    const [openDrawer, setOpenDrawer] = useState(false)

    const [paginated, setPaginated] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const numberOfItemsPerPage = 100
    

    //handler for switching openDeleteDialogue
    const handleOpenDeleteDialogue = () => setOpenDeleteDialogue(!openDeleteDialogue)

    const [initialAccountRecordsShown, setInitialAccountRecordsShown] = useState([])
    const [accountRecordsShown, setAccountRecordsShown] = useState([])
    const [chosenFilter, setChosenFilter] = useState({
      label: "",
      function: null
    })
    const [setOfAccountIdsToDelete, setSetOfAccountIdsToDelete] = useState(new Set())

    //function for fetching account records
    const fetchAllAccountRecords = async () => {
        setDisableButton(true)
        try {
            setIsLoading(true)
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account`)
            if (paginated) {
              const arrayOfAccountsInPage = data.data.filter((order, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
              setAccountRecordsShown(arrayOfAccountsInPage)
            } else {
              setAccountRecordsShown(data.data)
            }
            setInitialAccountRecordsShown(data.data)
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

    //handler for switching what is shown, either paginated or all of the account records
    const handleSwitchPagination = () => {
      if (paginated) {
        setToggleModify(false)
        setAccountRecordsShown(initialAccountRecordsShown)
        setPaginated(false)
      } else {
        const arrayOfAccountsInPage = initialAccountRecordsShown.filter((order, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
        setAccountRecordsShown(arrayOfAccountsInPage)
        setPaginated(true)
      }
      setChosenFilter({
        label: "",
        function: null
      })
    }

   //function for filtering the account record base on DSP
   const handleFilterDSP = (e) => {
    e.preventDefault()
    if (paginated) {
        const arrayOfRecordsFiltered = accountRecordsShown.filter((account) => {
            return account.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfRecordsFiltered)
    } else {
        const arrayOfRecordsFiltered = initialAccountRecordsShown.filter((account) => {
            return account.dsp.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfRecordsFiltered)
    }
}

  //function for filtering the account record base on the location
  const handleFilterLocation = (e) => {
    e.preventDefault()
    if (paginated) {
        const arrayOfFilteredLocation = accountRecordsShown.filter((account) => {
            return account.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredLocation)
    } else {
        const arrayOfFilteredLocation = initialAccountRecordsShown.filter((account) => {
            return account.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredLocation)
    }
}

//handler for filtering the account record base on the account name
const handleFilterAccountName = (e) => {
    e.preventDefault()
    if (paginated) {
        const arrayOfFilteredAccountName = accountRecordsShown.filter((account) => {
            return account.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredAccountName)
    } else {
        const arrayOfFilteredAccountName = initialAccountRecordsShown.filter((account) => {
            return account.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setAccountRecordsShown(arrayOfFilteredAccountName)
    }
  }

   //handler for choosing which to filter by
   const handleChooseFilterBy = (val) => {
    switch (val) {
      case "DSP": setChosenFilter({label: "DSP", function: handleFilterDSP})
      break;
      case "Location": setChosenFilter({label: "Location", function: handleFilterLocation})
      break;
      case "Account Name": setChosenFilter({label: "Account Name", function: handleFilterAccountName})
      break;
    }
   }

    //handler for sorting based on location
    const handleSortByLocation = () => {
      let tempArr = [...accountRecordsShown]
      tempArr.sort((a, b) => {
          if(a.location.trim() < b.location.trim()) {
              return -1
          } 
          if(a.location.trim() > b.location.trim()) {
              return 1
          }
          return 0
      })
      setAccountRecordsShown(tempArr)
  }

   //handler for sorting based on account name
   const handleSortByName = () => {
    let tempArr = [...accountRecordsShown]
    tempArr.sort((a, b) => {
        if(a.account_name.trim() < b.account_name.trim()) {
            return -1
        } 
        if(a.account_name.trim() > b.account_name.trim()) {
            return 1
        }
        return 0
    })
    setAccountRecordsShown(tempArr)
}

    //handler for selecting accounts to be deleted
    const handleSelectedAccounts = (e, accountObject) => {
      const {checked} = e.target;
      const tempSet = new Set([...setOfAccountIdsToDelete])
      if (checked) {
        tempSet.add(accountObject.account_id)
      } else {
        tempSet.delete(accountObject.account_id)
      }
      setSetOfAccountIdsToDelete(tempSet)
    }

    //handler for deleting selected accounts
    const handleDeleteSelectedAccounts = async (e) => {
      setDisableButton(true)
      try {
        const arrayOfAccountsToDelete = [...setOfAccountIdsToDelete]
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account/selected`, {
          data: {data: arrayOfAccountsToDelete},
          headers: {
              "Authorization": `Bearer ${token}`
          },
        })
        const filteredAccountRecords = accountRecordsShown.filter((account, index) => !setOfAccountIdsToDelete.has(account.account_id))
        const filteredInitialAccountsShown = initialAccountRecordsShown.filter((account, index) => !setOfAccountIdsToDelete.has(account.account_id))
        setSetOfAccountIdsToDelete(new Set())
        setAccountRecordsShown(filteredAccountRecords)
        setInitialAccountRecordsShown(filteredInitialAccountsShown)
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
        handleOpenDeleteDialogue()
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

    //memoized function for displaying large list of accounts
    const listOfAccountRecords = useMemo(() => {
      return accountRecordsShown.map(
        (
          {
            account_id,
            customer_number,
            account_name,
            location,
            dsp                
          },
          index,
        ) => {

          const isLast = index === accountRecordsShown.length - 1;
          const classes = isLast
            ? "p-4"
            : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={index}>
              <td className={classes}>
                <div className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="font-normal"> {customer_number} </Typography>
                </div>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {account_name} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {location} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {dsp} </Typography>
              </td>
              {toggleModify && 
                <>
                  <td>
                    <Checkbox color="teal" checked={setOfAccountIdsToDelete.has(account_id)} onChange={(e) => handleSelectedAccounts(e, {
                      account_id,
                      customer_number,
                      account_name,
                      location,
                      dsp  
                      })} className='h-5 w-5 border border-black'></Checkbox>
                  </td>
                </>
              }
            </tr>
          );
        },
      )
    }, [accountRecordsShown, toggleModify, setOfAccountIdsToDelete, handleSelectedAccounts])

    //function for the page buttons
    const getItemProps = (page) =>
    ({
      className: page === currentPage ? "bg-light font-bold" : "text-black font-bold bg-gray bg-opacity-30",
      onClick: () => {
        setCurrentPage(page)
        const arrayOfAccountsInPage = initialAccountRecordsShown.filter((order, index) => index < (numberOfItemsPerPage * page) && index >= numberOfItemsPerPage * (page - 1))
        setAccountRecordsShown(arrayOfAccountsInPage)
      },
    });
 
    const next = () => {
      if (currentPage === Math.ceil(initialAccountRecordsShown.length / numberOfItemsPerPage)) return;
      const arrayOfAccountsInPage = initialAccountRecordsShown.filter((order, index) => index < numberOfItemsPerPage * (currentPage + 1) && index >= numberOfItemsPerPage * currentPage)
      setAccountRecordsShown(arrayOfAccountsInPage)
      setCurrentPage(currentPage + 1);
    };
 
    const prev = () => {
      if (currentPage <= 1) return;
      const arrayOfAccountsInPage = initialAccountRecordsShown.filter((order, index) => index < numberOfItemsPerPage * (currentPage - 1) && index >= numberOfItemsPerPage * (currentPage - 2))
      setAccountRecordsShown(arrayOfAccountsInPage)
      setCurrentPage(currentPage - 1);
    };

    //function for returning numbers of page to show in pagination
    const numberOfPagesToShow = useMemo(() => {
      const totalNumberOfPages = Math.ceil(initialAccountRecordsShown.length / numberOfItemsPerPage)
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
    }, [initialAccountRecordsShown, currentPage, getItemProps])

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        fetchAllAccountRecords()
    },[fetchAllAccountRecords, router, token])

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
                Accounts
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the account records
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
                  <Option value='DSP'>DSP :</Option>
                  <Option value='Location'>Location :</Option>
                  <Option value='Account Name'>Account Name :</Option>
                </Select>
              </div>
              <Input type='search' label={`Type ${chosenFilter.label}`} disabled={!chosenFilter.function} onChange={chosenFilter.function}></Input>
          </div>
          <div className="flex w-full flex-wrap justify-evenly shrink-0 gap-2 md:w-[50%] lg:w-max">
            <Tooltip content="Reload">
              <IconButton variant="text">
                <AiOutlineReload className='h-6 w-6' disabled={disableButton} onClick={fetchAllAccountRecords}></AiOutlineReload>
              </IconButton>
            </Tooltip>
            <Tooltip content="Download">
              <IconButton variant="text">
                <ReactHTMLTableToExcel
                  id="export-accounts-button"
                  className="text-center cursor-pointer text-black p-1 shadow-2xl m-2 rounded"
                  table="export-account-table"
                  filename="Account Records"
                  sheet="Account"
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
            <Button onClick={handleOpenDeleteDialogue} variant="gradient" color="deep-orange" disabled={setOfAccountIdsToDelete.size === 0}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0 py-0">
        <table id='export-account-table' className="w-full min-w-max table-auto text-left">
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
            {listOfAccountRecords}
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
                <Button variant="gradient" color="green" disabled={disableButton} onClick={handleDeleteSelectedAccounts}>
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

export default AccountRecord