"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import {Toaster} from "react-hot-toast"
import Navbar from './Navbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

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

    const [arrayOfMonth, setArrayOfMonth] = useState("")
    const [fullYearData, setFullYearData] = useState("")
    const [currentMonth, setCurrentMonth] = useState("")

    const fetchAllOrderData = async () => {
        try {
          const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/data`)
          setArrayOfMonth(data.data.months)
          setFullYearData(data.data.year)
          setCurrentMonth(data.data.currentMonth)
        } catch (error) {
          console.log(error)
        }
    }

    console.log(fullYearData)
    console.log(arrayOfMonth)
  
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
      <Navbar></Navbar>
      <div className='bg-dark w-full md:w-[85%] min-h-[86vh] flex flex-col justify-evenly'>
        <div className='w-full min-h-[20vh] flex flex-wrap justify-evenly'>
          <div className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>ORDERS AND PRODUCTS</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>TOTAL ORDERS</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(arrayOfMonth[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{fullYearData?.orders}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold'>CURRENT MONTH ORDERS</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{currentMonth?.total_orders}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>TOTAL PRODUCTS SOLD</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(arrayOfMonth[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{fullYearData?.products}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold'>CURR. MONTH PRODUCTS SOLD</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{currentMonth?.total_products}</p>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>PRODUCTS AND ORDERS EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[33%] border-[1px] border-light bg-medium rounded'>
      <ResponsiveContainer style={{fill: "white"}}>
        <BarChart
          width={500}
          height={300}
          data={arrayOfMonth}
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
          <Bar dataKey="orders" fill="#82ca9d" />
          <Bar dataKey="products" fill="#FF8042" />
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
          {/* <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
      </div>
        
      <div className='w-full min-h-[20vh] flex flex-wrap justify-evenly'>
          <div className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            {/* <h1 className='text-xs md:text-base'>TOTAL ORDERS</h1> */}
            <p className='m-auto md:text-xl font-bold'>SALES</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>TOTAL SALES</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(arrayOfMonth[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{fullYearData?.sales}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold'>CURRENT MONTH SALES</h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>{currentMonth?.total_sales}</p>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>SALES EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[33%] border-[1px] border-light rounded bg-medium'>
      <ResponsiveContainer style={{fill: "white"}}>
        <BarChart
          width={500}
          height={300}
          data={arrayOfMonth}
          // data={arrayOfMonth}
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
          {/* <Bar dataKey="pv" fill="#8884d8" /> */}
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
          {/* <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
      </div>
      </div>
    </div>
    <Toaster></Toaster>
    </>
  }</>
  )
}

export default Home