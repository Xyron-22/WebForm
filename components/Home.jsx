"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import { jwtDecode } from 'jwt-decode'
import {Toaster} from "react-hot-toast"
import Link from 'next/link'
import {GrTableAdd, GrTable} from "react-icons/gr"
import {IoMdOpen} from "react-icons/io"
import {MdAdminPanelSettings} from "react-icons/md"
import Navbar from './Navbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

const data = [
  {
    date: '2000-01',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: '2000-02',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: '2000-03',
    uv: 2000,
    pv: 800,
    amt: 2290,
  },
  {
    date: '2000-04',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: '2000-05',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    date: '2000-06',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    date: '2000-07',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    date: '2000-08',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: '2000-09',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: '2000-10',
    uv: 2000,
    pv: 800,
    amt: 2290,
  },
  {
    date: '2000-11',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: '2000-12',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

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
  
    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
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
            <p className='m-auto text-3xl md:text-5xl font-bold'>2254</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>CURRENT MONTH ORDERS</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>P2,254</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>TOTAL PRODUCTS SOLD</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>2254</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>CURR. MONTH PRODUCTS SOLD</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>P2,254</p>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>PRODUCTS AND ORDERS EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[30%]'>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: -25,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={monthTickFormatter} />
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#FF8042" />
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
            <p className='m-auto text-3xl md:text-5xl font-bold'>142</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base'>CURRENT MONTH SALES</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold'>P2,254</p>
          </div>
        </div>
        <h1 className='m-auto text-lightText font-bold text-center'>SALES EVERY MONTH</h1>
        <div className='w-full min-h-[30vh] text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[30%]'>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: -25,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={monthTickFormatter} />
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#8884d8" />
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