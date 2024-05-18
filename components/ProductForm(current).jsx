"use client"

import React, { useLayoutEffect,  useState, useRef } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import useStore from '@/stateManagement/store';
import { useRouter } from 'next/navigation';
import toast, {Toaster} from "react-hot-toast";
import ReactLoading from "react-loading";
import DspData from '@/data/DspData';
import DrawerNav from './DrawerNav';
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
    Textarea,
    Alert
 } from '@material-tailwind/react';

const AccountForm = () => {

    const form = useRef(null)

    const token = useStore((state) => state.token)
    
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [errorInformation, setErrorInformation] = useState("")
    const [openAlert, setOpenAlert] = useState({
        status: false,
        message: "",
        color: "green"
      })
    let timeOut;
    const [openDrawer, setOpenDrawer] = useState(false)

    const [product, setProduct] = useState({
        matCode: "",
        matDescription: "",
        productFamily: "",
        volume: "",
        stocks: ""
    })

    const [disableButton, setDisableButton] = useState(false)

    //function for submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        if (
            product.matCode !== ""
            && product.matDescription !== ""
            && product.volume !== ""
            && product.stocks !== ""
        ) {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`, form.current, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                setProduct({
                    matCode: "",
                    matDescription: "",
                    productFamily: "",
                    volume: "",
                    stocks: ""
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
                        message: ""
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
        setDisableButton(false)
        router.replace("#product-form")
    }

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        setIsLoading(false)
      }, [])

  return (
    <>
    {errorInformation.status === "failed" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>
    {isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
        <Card className='w-full lg:w-[80%] min-h-screen rounded-none' id='product-form'>
            <CardHeader
            floated={false}
            shadow={true}
            color="transparent"
            className="m-0 rounded-none text-center p-5 flex justify-between">
                <Button className='p-2 mr-1 rounded-full bg-light text-white' onClick={() => setOpenDrawer(true)}>
                    <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
                </Button>   
                <Typography variant='h4' className='font-black'>PRODUCT FORM</Typography>
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
            <CardBody>
                <form ref={form}>
                    <div className='my-3 w-full flex flex-col items-center'>
                        <Chip color='blue-gray' variant='gradient' size='lg' value="Material Code" className='w-full my-2'></Chip>
                        <Typography className='text-center my-2'>Enter material code</Typography>
                        <Typography variant='h6' className='text-center my-2'>Material code: {product.matCode}</Typography>
                        <div className='w-full md:w-[70%] lg:w-[60%]'>
                            <Input type='number' name='matCode' label='Material Code' value={product.matCode} onChange={(e) => setProduct({...product, matCode: e.target.value})} required></Input>
                        </div>
                    </div>
                    <div className='my-3 w-full flex flex-col items-center'>
                        <Chip color='blue-gray' variant='gradient' size='lg' value="Material Description" className='w-full my-2'></Chip>
                        <Typography className='text-center my-2'>Enter material description</Typography>
                        <Typography variant='h6' className='text-center my-2'>Material description: {product.matDescription}</Typography>
                        <div className='w-full md:w-[70%] lg:w-[60%]'>
                            <Textarea type='text' name='matDescription' label='Material Description' value={product.matDescription} onChange={(e) => setProduct({...product, matDescription: e.target.value})} required></Textarea>
                        </div>
                    </div>
                    <div className='my-3 w-full flex flex-col items-center'>
                        <Chip color='blue-gray' variant='gradient' size='lg' value="Product Family" className='w-full my-2'></Chip>
                        <Typography className='text-center my-2'>Enter product family</Typography>
                        <Typography variant='h6' className='text-center my-2'>Product family: {product.productFamily}</Typography>
                        <div className='w-full md:w-[70%] lg:w-[60%]'>
                            <Input type='text' name='productFamily' label='Product Family' value={product.productFamily} onChange={(e) => setProduct({...product, productFamily: e.target.value})}></Input>
                        </div>
                    </div>
                    <div className='my-3 w-full flex flex-col items-center'>
                        <Chip color='blue-gray' variant='gradient' size='lg' value="UOM" className='w-full my-2'></Chip>
                        <Typography className='text-center my-2'>Enter uom</Typography>
                        <Typography variant='h6' className='text-center my-2'>UOM: {product.volume}</Typography>
                        <div className='w-full md:w-[70%] lg:w-[60%]'>
                            <Input type='number' name='volume' label='UOM' value={product.volume} onChange={(e) => setProduct({...product, volume: e.target.value})} required></Input>
                        </div>
                    </div>
                    <div className='my-3 w-full flex flex-col items-center'>
                        <Chip color='blue-gray' variant='gradient' size='lg' value="Stocks" className='w-full my-2'></Chip>
                        <Typography className='text-center my-2'>Enter stocks</Typography>
                        <Typography variant='h6' className='text-center my-2'>Stocks: {product.stocks}</Typography>
                        <div className='w-full md:w-[70%] lg:w-[60%]'>
                            <Input type='number' name='stocks' label='Stocks' value={product.stocks} onChange={(e) => setProduct({...product, stocks: e.target.value})} required></Input>
                        </div>
                    </div>
                </form>
            </CardBody>
            <CardFooter className='w-full flex justify-center'>
                <Button variant='gradient' color='teal' type='submit' size='lg' disabled={disableButton} className='mb-5 m-2 p-2 text-lg' onClick={handleSubmit}>Submit Form</Button>
            </CardFooter>
            <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
        </Card>
    </>}
    </>
  }</>
  )
}

export default AccountForm