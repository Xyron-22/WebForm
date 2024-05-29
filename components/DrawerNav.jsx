"use client"

import React, { useState, useLayoutEffect } from 'react'
import { Drawer, Typography, Button, Chip, Card } from '@material-tailwind/react'
import useStore from '@/stateManagement/store'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import {VscAccount} from "react-icons/vsc"
import {AiOutlineFileAdd} from "react-icons/ai"
import { RxTable } from "react-icons/rx";
import {IoPersonAddOutline, IoCheckmarkDoneSharp, IoAnalyticsSharp} from "react-icons/io5"
import {MdOutlineAddCircleOutline, MdClose, MdOutlineLogout} from "react-icons/md"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbBrandBooking, TbBrandProducthunt } from "react-icons/tb";

const DrawerNav = ({openDrawer, setOpenDrawer}) => {

    const setTokenToNull = useStore((state) => state.setTokenToNull)
    const token = useStore((state) => state.token)

    const [decodedToken, setDecodedToken] = useState()

    const router = useRouter()

    const handleLogout = () => {
        Cookies.remove("jwt")
        setTokenToNull()
        router.replace("/auth/login")
    }
    
    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        setDecodedToken(decodedToken)
    },[router, token])

  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} className="p-4 overflow-auto">
    <div className="mb-6 flex items-center justify-between">
      <Typography variant="h5" color="blue-gray">
        Navigation
      </Typography>
      <Button className='text-black text-md p-0' onClick={() => setOpenDrawer(false)}><MdClose></MdClose></Button> 
    </div>
    <div>
        {decodedToken?.role === process.env.NEXT_PUBLIC_AUTHORIZED_ROLE ? 
        <>
        <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="ORDERS" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/orders/booking"} className='mt-1 flex items-center'>
                <TbBrandBooking className='mr-1 text-4xl text-light'></TbBrandBooking>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Bookings
                    <Typography className='text-xs font-semibold'>Pending Orders</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/orders/invoiced"} className='mt-1 flex items-center'>
                <LiaFileInvoiceDollarSolid className='mr-1 text-4xl text-light'></LiaFileInvoiceDollarSolid>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Invoiced
                    <Typography className='text-xs font-semibold'>Invoiced Orders</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/orders/paid"} className='mt-1 flex items-center'>
                <IoCheckmarkDoneSharp className='mr-1 text-4xl text-light'></IoCheckmarkDoneSharp>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Paid
                    <Typography className='text-xs font-semibold'>Paid Orders</Typography>
                </Typography>
            </Link>
        </Card>
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="RECORDS" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/records/order"} className='mt-1 flex items-center'>
                <RxTable className='mr-1 text-4xl text-light'></RxTable>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Orders
                    <Typography className='text-xs font-semibold'>All Order Records</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/records/account"} className='mt-1 flex items-center'>
                <VscAccount className='mr-1 text-4xl text-light'></VscAccount>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Accounts
                    <Typography className='text-xs font-semibold'>Records of Accounts</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/records/product"} className='mt-1 flex items-center'>
                <TbBrandProducthunt className='mr-1 text-4xl text-light'></TbBrandProducthunt>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Products
                    <Typography className='text-xs font-semibold'>Records of Products</Typography>
                </Typography>
            </Link>
        </Card>
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="FORMS" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/form/order"} className='mt-1 flex items-center'>
                <AiOutlineFileAdd className='mr-1 text-4xl text-light'></AiOutlineFileAdd>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    New Order
                    <Typography className='text-xs font-semibold'>Book an order</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/form/account"} className='mt-1 flex items-center'>
                <IoPersonAddOutline className='mr-1 text-4xl text-light'></IoPersonAddOutline>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    New Account
                    <Typography className='text-xs font-semibold'>Add new account</Typography>
                </Typography>
            </Link>
        </Card>
        <Card className='hover:underline ml-3'>
            <Link href={"/form/product"} className='mt-1 flex items-center'>
                <MdOutlineAddCircleOutline className='mr-1 text-4xl text-light'></MdOutlineAddCircleOutline>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    New Product
                    <Typography className='text-xs font-semibold'>Add new product</Typography>
                </Typography>
            </Link>
        </Card>           
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="DASHBOARD" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/"} className='mt-1 flex items-center'>
                <IoAnalyticsSharp className='mr-1 text-4xl text-light'></IoAnalyticsSharp>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Analytics
                    <Typography className='text-xs font-semibold'>Data from paid orders</Typography>
                </Typography>
            </Link>
        </Card>    
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Button color='deep-orange' variant='gradient' className='m-auto flex items-center' onClick={handleLogout}>
            <MdOutlineLogout className='text-xl'></MdOutlineLogout>
            SIGN OUT
        </Button>
    </div>
    </> :
    <>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="RECORDS" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/records/order"} className='mt-1 flex items-center'>
                <RxTable className='mr-1 text-4xl text-light'></RxTable>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    Orders
                    <Typography className='text-xs font-semibold'>All Order Records</Typography>
                </Typography>
            </Link>
        </Card>    
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Chip className='p-2 text-sm' value="FORMS" variant="gradient" color="blue-gray"></Chip>
        <Card className='hover:underline ml-3'>
            <Link href={"/form/order"} className='mt-1 flex items-center'>
                <AiOutlineFileAdd className='mr-1 text-4xl text-light'></AiOutlineFileAdd>
                <Typography color='blue-gray' variant='h6' className='ml-2'>
                    New Order
                    <Typography className='text-xs font-semibold'>Book an order</Typography>
                </Typography>
            </Link>
        </Card>    
    </div>
    <div className='w-full min-h-[10%] text-black flex flex-col justify-between flex-wrap bg-white p-5'>
        <Button color='deep-orange' variant='gradient' className='m-auto flex items-center' onClick={handleLogout}>
            <MdOutlineLogout className='text-xl'></MdOutlineLogout>
            SIGN OUT
        </Button>
    </div>
    </>
    }
    </div>
     </Drawer>
  )
}

export default DrawerNav