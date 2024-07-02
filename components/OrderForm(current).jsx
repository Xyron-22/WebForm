"use client"

import React, {useState, useLayoutEffect, useMemo} from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import useStore from '@/stateManagement/store';
import { useRouter } from 'next/navigation';
import toast, {Toaster} from "react-hot-toast";
import Link from 'next/link';
import ReactLoading from "react-loading";
import DspData from '@/data/DspData';
import TermsData from '@/data/TermsData';
import DrawerNav from './DrawerNav';
import Modal from './Modal';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Typography, 
    Tooltip, 
    Button, 
    Input, 
    Chip, 
    Radio,
    List,
    ListItem,
    ListItemSuffix,
    IconButton,
    Textarea,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Alert
 } from '@material-tailwind/react';

const OrderForm = ({data}) => {
    const token = useStore((state) => state.token)
  const setTokenToNull = useStore((state) => state.setTokenToNull)
     
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isOutletArrayLoading, setIsOutletArrayLoading] = useState(false)
  const [openAlert, setOpenAlert] = useState({
    status: false,
    message: "",
    color: "green"
  })
  let timeOut;
  const [openDrawer, setOpenDrawer] = useState(false)
  const [errorInformation, setErrorInformation] = useState("")

  // DSP ASSIGNED -----------------------------------------------------
  //state for DSP Assigned
  const [dspAssigned, setDspAssigned] = useState("") //do not remove

  // OUTLET NAME -----------------------------------------------------
  //state for the initial array of outlet names
  const [outletArray, setOutletArray] = useState([]) //do not remove
  const [outletArrayToSearchAgainstWith, setOutletArrayToSearchAgainstWith] = useState()
  const [accountSelected, setAccountSelected] = useState("")//do not remove
 
  // PRODUCTS -------------------------------------------------------------
  //state for single product
  const [product, setProduct] = useState({
    product: "",
    productId: "",
    quantity: "",
    price: ""
  })
  //state for the initial array of products
  const [initialProductArray, setInitialProductArray] = useState(data.data || [])
  //state for array of products added
  const [arrayProducts, setArrayProducts] = useState([])

  // FORM
  //state for whole form complete with all the fields
  const [form, setForm] = useState({
    orderDate: "",
    accountId: "",   
    customerName: "",
    tinNumber: "",
    contactNumber: "",
    term: "",
    products: "",
    remarksFreebiesConcern: "",
    deliveryDate: "",
    auth_id: null
  })

  // DIALOGUE TOGGLE ------------------------------------------------------------------
  //state for toggling the dialogue
  const [toggleAddProductDialogue, setToggleAddProductDialogue] = useState(false)

  const [disableButton, setDisableButton] = useState(false)
        
    //function for removing a product in the array of added products
    const handleRemoveProductOnArray = (e, prod) => {
      e.preventDefault();
      let tempArrayOfProducts = arrayProducts;
      tempArrayOfProducts = tempArrayOfProducts.filter((product) => {
        return product.product !== prod
      })
      setForm({...form, products: tempArrayOfProducts})
      setArrayProducts(tempArrayOfProducts)
    }

    //function for searching products in the lists of products
    const handleSearchProduct = (e) => {
      const newArr = data.data.filter((prod) => prod.mat_description.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setInitialProductArray(newArr)
    }
    
    //function for searching products in the lists of products
    const handleSearchOutletName = (e) => {
      const newArr = outletArrayToSearchAgainstWith.filter((outlet) => outlet.account_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setOutletArray(newArr)
    }

    //function for searching outlet by location
    const handleSearchLocation = (e) => {
      const newArr = outletArrayToSearchAgainstWith.filter((outlet) => outlet.location.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setOutletArray(newArr)
    }
    ///////
    const toggleDialogue = () => {
        setProduct({
            product: "",
            productId: "",
            quantity: "",
            price: ""
        })
        setToggleAddProductDialogue(!toggleAddProductDialogue)
    }
    
    //function for filling in the fields of a single product
    const handleProduct = (e) => {
        e.preventDefault();
        setProduct({...product, [e.target.name]: e.target.value})
    }

    //function for adding a product in the array of added products
    const handleAddProduct = (e) => {
        e.preventDefault();
        if(product.quantity !== undefined && product.price !== undefined) {
            toast.success("Product Added", {
                duration: 3000,
                className: "text-2xl"
            })
            setArrayProducts([...arrayProducts, product])
            setForm({...form, products: [...arrayProducts, product]})
            toggleDialogue(e)
        } 
      }
  
    //////////
    //function for fetching account records based on dsp
    const handleFetchAccountBasedOnDsp = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        try {
          setIsOutletArrayLoading(true)
          setDspAssigned(e.target.value)
          const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account/${e.target.value}`)
          setForm({
            ...form,
            accountId: ""
          })
          setAccountSelected("")
          setOutletArray(data.data)
          setOutletArrayToSearchAgainstWith(data.data)
          setIsOutletArrayLoading(false)
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

    //function for submitting the form
    const handleSubmit = async (e) => {
      e.preventDefault();
      setDisableButton(true)
      if(
      form.customerName !== "" 
      && form.orderDate !== ""
      && form.accountId !== ""
      && form.term !== "" 
      && form.products !== "" 
      && form.remarksFreebiesConcern !== "" 
      && form.deliveryDate !== ""
      && form.auth_id !== null) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`, form, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
          setDspAssigned("")
          setAccountSelected("")
          setOutletArray([])
          setArrayProducts([])
          setForm({
          ...form,
          orderDate: "",
          accountId: "",
          customerName: "",
          tinNumber: "",
          contactNumber: "",
          term: "",
          products: "",
          remarksFreebiesConcern: "",
          deliveryDate: "",
      })
      clearTimeout(timeOut)
      setOpenAlert({
        status: true,
        message: "Submitted Successfully",
        color: "green"
      })
      timeOut = setTimeout(() => {
        setOpenAlert({
            ...openAlert,
            status: false,
            message: "",
        })
      }, 3000)
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
      } else {
        clearTimeout(timeOut)
        setOpenAlert({
            status: true,
            message: "All fields are required.",
            color: "orange"
        })
        timeOut = setTimeout(() => {
            setOpenAlert({
                ...openAlert,
                status: false,
                message: "",
            })
        }, 3000)
      }
      router.replace("#order-form")
      setDisableButton(false)
    }

    //memoized initialArrayOfProducts
    const memoizedInitialArrayOfProducts = useMemo(() => {
      return initialProductArray.map((val, i) => {
        return (
            <Button variant='gradient' color='teal' className='h-[25%] m-1 hover:cursor-pointer shadow hover:scale-110 p-1' key={i} name="product" type='button' value={val.mat_description} onClick={(e) => {
            setToggleAddProductDialogue(() => !toggleAddProductDialogue);
            setProduct({
                product: val.mat_description,
                productId: val.product_id
            })
            }}>
                {val.mat_description}
            </Button>
        )
      })
    }, [initialProductArray, toggleAddProductDialogue])

    //memoized outletArray
    const memoizedOutletArray = useMemo(() => {
      return outletArray.map((val, i) => {
        return (
        <Button variant='gradient' color="teal" className='h-[25%] m-1 hover:cursor-pointer p-1 shadow hover:scale-110' key={i} name="outlet" type='button' value={`${val.account_name},  ${val.location}`} onClick={(e) => {
            setAccountSelected(e.target.value)
            setForm({...form, accountId: val.account_id})
        }}>
            {`${val.account_name},  ${val.location}`}
        </Button>
        )
    })
    }, [outletArray, form])

    useLayoutEffect(() => {
      if (!token) return router.replace("/auth/login")
      const decodeToken = jwtDecode(token)
    if (decodeToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodeToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) {
      router.replace("/auth/login")
    } else {
        setForm({...form, auth_id: decodeToken.id})
        setIsLoading(false)
      }
    }, [router, token])

  return (
    <>
    {data.status === "failed" || data.status === "error" || errorInformation.status === "failed" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{data.message || errorInformation.message}</div> : 
    <>
    {isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <Card className='w-full lg:w-[80%] min-h-screen rounded-none' id='order-form'>
        <CardHeader 
        floated={false}
        shadow={true}
        color="transparent"
        className="m-0 rounded-none text-center p-5 flex justify-between">
            <Button className='p-2 mr-1 rounded-full bg-light text-white' onClick={() => setOpenDrawer(true)}>
                <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
            </Button>   
            <Typography variant='h4' className='font-black'>ORDER FORM</Typography>
            <div className='p-2 ml-1 rounded-full bg-white text-white select-none' id="element-for-centering-heading">
                <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
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
        </CardHeader>
        <CardBody className='p-5 w-full'>
            <div className='my-3'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Order Date" className='w-full my-2'></Chip>
                <div className='mx-4 md:mx-0 md:w-full md:flex flex-col items-center my-2'>
                    <Typography className='my-2'>Choose a date</Typography>
                    <Typography variant='h6' className='my-2'>Date: {new Date(form.orderDate).toDateString()}</Typography>
                    <div className='md:w-[30%] my-2'>
                        <Input type='date' name='orderDate' value={form.orderDate} onChange={(e) => setForm({...form, orderDate: e.target.value})}></Input>
                    </div>
                </div>
            </div>
            <div className='my-3'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="DSP Assigned" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Select DSP</Typography>
                <div className='flex justify-center flex-wrap my-2'>
                {DspData.map((dsp, i) => {
                    return (
                    <div className='m-1 flex flex-col' key={i}>
                    <Radio onChange={handleFetchAccountBasedOnDsp} type='button' value={dsp} label={dsp} checked={dspAssigned === dsp} disabled={disableButton}></Radio>
                    </div>
                    )
                })}
                </div>
            </div>
            <div className='my-3 w-full'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Outlet Name" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Choose an outlet name</Typography>
                <Typography variant='h6' className='text-center my-2'>Outlet name: {accountSelected}</Typography>
                <div className='my-2 w-full flex flex-col items-center md:flex-row md:justify-center'>
                    <div className='w-full md:w-[35%] md:mx-1 lg:w-[30%] my-1'><Input type='search' label='Search Outlet Name' onChange={handleSearchOutletName}></Input></div>
                    <div className='w-full md:w-[35%] md:mx-1 lg:w-[30%] my-1'><Input type='search' label='Search Location' onChange={handleSearchLocation}></Input></div>
                </div>
                <div className='w-full my-2 flex flex-wrap border border-black h-[20vh] overflow-auto'>
                    {isOutletArrayLoading ? <ReactLoading type={"spin"} color={"#000000"} height={"5%"} width={"5%"} className="m-auto"></ReactLoading> : 
                    memoizedOutletArray}
                </div>
            </div>
            <div className='my-3 w-full flex flex-col items-center'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Customer Name" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Enter customer name</Typography>
                <Typography variant='h6' className='text-center my-2'>Customer name: {form.customerName}</Typography>
                <div className='w-full md:w-[70%] lg:w-[60%]'>
                    <Input type='text' name='customerName' label='Customer Name' value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})}></Input>
                </div>
            </div>
            <div className='my-3 w-full flex flex-col items-center'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="TIN And Contact Number (OPTIONAL)" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Enter TIN and Contact number</Typography>
                <Typography variant='h6' className='text-center my-2'>TIN: {form.tinNumber}</Typography>
                <Typography variant='h6' className='text-center my-2'>Contact number: {form.contactNumber}</Typography>
                <div className='my-2 w-full flex flex-col items-center md:flex-row md:justify-center'>
                    <div className='w-full md:w-[35%] md:mx-1 lg:w-[30%] my-1'><Input name='TIN' type='text' label='TIN Number' value={form.tinNumber} onChange={(e) => setForm({...form, tinNumber: e.target.value})}></Input></div>
                    <div className='w-full md:w-[35%] md:mx-1 lg:w-[30%] my-1'><Input name='Contact' type='number' label='Contact Number' value={form.contactNumber} onChange={(e) => setForm({...form, contactNumber: e.target.value})}></Input></div>
                </div>
            </div>
            <div className='my-3'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Terms" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Select Term</Typography>
                <div className='flex justify-center flex-wrap my-2'>
                {TermsData.map((termValue, i) => {
                    return (
                    <div className='m-1 flex flex-col' key={i}>
                    <Radio name="term" value={termValue} onChange={(e) => setForm({...form, term: e.target.value})} label={termValue} checked={form.term === termValue} disabled={disableButton}></Radio>
                    </div>
                    )
                })}
                </div>
            </div>
            <div className='my-3 w-full flex flex-col items-center'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Products" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Choose Products</Typography>
                <Typography variant='h6' className='text-center my-2'>Products added:</Typography>
                <List className='w-full my-2'>
                    {arrayProducts.map(({product, quantity, price}, i) => {
                        return (
                            <ListItem ripple key={i} className='cursor-default w-full md:w-[60%] m-auto'>
                                <Typography variant='h6' className='break-all'>Product: {product} | Quantity: {quantity} | Price: &#x20B1;{price},</Typography>
                                <ListItemSuffix>
                                    <IconButton variant='text' color='blue-gray' onClick={(e) => handleRemoveProductOnArray(e, product)}>
                                        <FaRegTrashAlt className='text-xl text-red'></FaRegTrashAlt>
                                    </IconButton>
                                </ListItemSuffix>
                            </ListItem>  
                        )
                    })}               
                </List>
                <div className='w-full md:w-[70%] lg:w-[60%] my-2'>
                    <Input type='search' label='Search Product' onChange={handleSearchProduct}></Input>
                </div>
                <div className='w-full my-2 flex flex-wrap border border-black h-[20vh] overflow-auto'>
                    {memoizedInitialArrayOfProducts}
                </div>
            </div>
            <div className='my-3 w-full flex flex-col items-center'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Remarks/Freebies/Concern" className='w-full my-2'></Chip>
                <Typography className='text-center my-2'>Enter Remarks/Freebies/Concern</Typography>
                <Typography variant='h6' className='text-center my-2'>Remarks/Freebies/Concern: {form.remarksFreebiesConcern}</Typography>
                <div className='w-full md:w-[70%] lg:w-[60%]'>
                    <Textarea type='text' name='remarksFreebiesConcern' label='Remarks/Freebies/Concern' value={form.remarksFreebiesConcern} onChange={(e) => setForm({...form, remarksFreebiesConcern: e.target.value})}></Textarea>
                </div>
            </div>
            <div className='my-3'>
                <Chip color='blue-gray' variant='gradient' size='lg' value="Delivery Date" className='w-full my-2'></Chip>
                <div className='mx-4 md:mx-0 md:w-full md:flex flex-col items-center my-2'>
                    <Typography className='my-2'>Choose a date</Typography>
                    <Typography variant='h6' className='my-2'>Date: {new Date(form.deliveryDate).toDateString()}</Typography>
                    <div className='md:w-[30%] my-2'>
                        <Input type='date' name='deliveryDate' value={form.deliveryDate} onChange={(e) => setForm({...form, deliveryDate: e.target.value})}></Input>
                    </div>
                </div>
            </div>
        </CardBody>
        <CardFooter className='w-full flex justify-center'>
            <Button variant='gradient' color='teal' type='submit' size='lg' disabled={disableButton} className='mb-5 m-2 p-2 text-lg' onClick={handleSubmit}>Submit Form</Button>
        </CardFooter>
        <Dialog open={toggleAddProductDialogue} handler={toggleDialogue}>
        <DialogHeader>{product.product}</DialogHeader>
        <DialogBody>
            <div>
                <div className='flex flex-row justify-between m-5'>
                    <Input name='price' type='number' placeholder='1' label='Price' className='rounded border border-black' onChange={handleProduct} required></Input>
                </div>
                <div className='flex flex-row justify-between m-5'>
                    <Input name='quantity' type='number' placeholder='1' label='Quantity' className='rounded border border-black' onChange={handleProduct} required></Input>
                </div>
            </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={toggleDialogue}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={(e) => {
                handleAddProduct(e)
            }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </Card>
    </>}
    </>
  }</>
  )
}

export default OrderForm