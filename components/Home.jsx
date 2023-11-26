"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import {Toaster} from "react-hot-toast"
import Navbar from './Navbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Tooltip as ReactToolTip} from 'react-tooltip'
import {RiArrowUpDoubleFill, RiArrowDownDoubleFill} from "react-icons/ri"
import {HiMiniInformationCircle} from "react-icons/hi2"
import {GiHamburgerMenu} from "react-icons/gi"

const monthTickFormatter = (tick) => {
  const date = new Date(tick);

  return date.getMonth() + 1;
};

const renderQuarterTick = (tickProps) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return null;
};

const Home = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)
    
    const [isLoading, setIsLoading] = useState(true)

    const [orderData, setOrderData] = useState({
      months: [],
      year: {
        orders: 0,
        products: 0,
        sales: 0
      },
      currentMonth: {
        year_date: "",
        total_orders: 0,
        total_products: 0,
        total_sales: 0
      },
      previousMonth: {
        date: "",
        orders: 0,
        products: 0,
        sales: 0
      }
    })

    const [toggleNavbar, setToggleNavbar] = useState(false)

    //function for fetching order data needed for analytics
    const fetchAllOrderData = async () => {
        try {
          const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/data`)
          setOrderData(data.data)
        } catch (error) {
          console.log(error)
        }
    }

    //function for calculating the percentage of changes from previos month
    const compareToPreviousMonth = (currentMonthData, previousMonthData) => {
      if (orderData.previousMonth) {
        if (((currentMonthData * 100) / previousMonthData - 100) !== 0) {
          return ((currentMonthData * 100) / previousMonthData - 100)
        } else {
          return -100
        }
      } else {
        return 100
      }
    }
  
    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        
        fetchAllOrderData()
        setIsLoading(false)        
    },[])

  return (<>{
    isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className='w-full bg-petron rounded flex flex-wrap'>
      <Navbar toggleNavbar={toggleNavbar} setToggleNavbar={setToggleNavbar}></Navbar>
      <div className={`bg-dark w-full md:w-[85%] min-h-[86vh] flex flex-col justify-evenly ${toggleNavbar ? "hidden" : "inline"}`}>
        <div className='w-full min-h-[20vh] flex flex-wrap justify-evenly'>
          <GiHamburgerMenu className='font-bold m-auto min-w-[12%] min-h-[10%] rounded bg-medium border-[1px] border-light text-lightText md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}/>          
          <div id='orders' className='min-w-[80%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold my-2 mr-2 md:m-2 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>ORDERS AND PRODUCTS</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL ORDERS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total orders this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#0088FE]'>{orderData?.year?.orders}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH ORDERS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Current month orders and percentage compared to previous month's"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#0088FE]'>{orderData?.currentMonth?.total_orders}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders).toFixed(2)) || 0}%
              </span>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL PRODUCTS SOLD<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total products sold this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF8042]'>{orderData?.year?.products}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH PRODUCTS SOLD<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Current month products sold and percentage compared to previous month's"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF8042]'>{orderData?.currentMonth?.total_products}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products).toFixed(2)) || 0}%
              </span>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>PRODUCTS AND ORDERS EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[28%] border-[1px] border-light bg-medium rounded'>
      <ResponsiveContainer style={{fill: "white"}}>
        <BarChart
          width={500}
          height={300}
          data={orderData?.months}
          margin={{
            top: 10,
            right: 5,
            left: -5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="0" vertical={false}/>
          <XAxis dataKey="date" tickFormatter={monthTickFormatter} tick={{fill: "white"}}/>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick}
            height={1}
            scale="band"
            xAxisId="quarter"
          />
          <YAxis tick={{fill: "white"}}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#0088FE" />
          <Bar dataKey="products" fill="#FF8042" />
       </BarChart>
      </ResponsiveContainer>
      </div>
        
      <div className='w-full min-h-[20vh] flex flex-wrap justify-evenly'>
          <div id='sales' className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>SALES</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL SALES<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total sales this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#8884d8]'>{orderData?.year?.sales}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH SALES<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Current month sales and percentage compared to previous month's"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#8884d8]'>{orderData?.currentMonth?.total_sales}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales).toFixed(2)) || 0}%
              </span>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>SALES EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[28%] border-[1px] border-light rounded bg-medium'>
      <ResponsiveContainer style={{fill: "white"}}>
        <BarChart
          width={500}
          height={300}
          data={orderData?.months}
          margin={{
            top: 10,
            right: 5,
            left: -5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="0" vertical={false}/>
          <XAxis dataKey="date" tickFormatter={monthTickFormatter} tick={{fill: "white"}}/>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick}
            height={1}
            scale="band"
            xAxisId="quarter"
          />
          <YAxis tick={{fill: "white"}}/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      </div>
    </div>
    <ReactToolTip id='my-tooltip'/>
    <Toaster></Toaster>
    </>
  }</>
  )
}

export default Home