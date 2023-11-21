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

const data2 = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100,
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700,
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
     <div className='w-full h-[86vh] bg-petron rounded flex flex-wrap overflow-auto'>
      <Navbar></Navbar>
      <div className='bg-dark w-full md:w-[85%] min-h-full flex flex-col justify-evenly'>
        <div className='w-full min-h-[40%] flex flex-wrap justify-evenly'>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>TOTAL ORDERS</h1>
            <p className='m-auto text-5xl font-bold'>2254</p>
          </div>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightGreen font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>DSP 1</h1>
            <p className='m-auto text-5xl font-bold'>254</p>
          </div>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-red font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>DSP 2</h1>
            <p className='m-auto text-5xl font-bold'>154</p>
          </div>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>DSP 3</h1>
            <p className='m-auto text-5xl font-bold'>2254</p>
          </div>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>DSP 4</h1>
            <p className='m-auto text-5xl font-bold'>2254</p>
          </div>
          <div className='min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-2 flex flex-col flex-wrap rounded p-2'>
            <h1>DSP 5</h1>
            <p className='m-auto text-5xl font-bold'>2254</p>
          </div>
        </div>
        <div className='w-full h-[30%] text-xs'>
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
          <CartesianGrid strokeDasharray="3 3" />
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
          <Bar dataKey="pv" fill="#8884d8" />
          {/* <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div className='w-full h-[30%] text-xs'>
      <ResponsiveContainer>
        <ComposedChart
          width={500}
          height={400}
          data={data2}
          margin={{
            top: 10,
            right: 5,
            bottom: 5,
            left: -25,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
      </div>
      </div>
        {/* <h1 className='py-5 text-lg md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-darkRed via-red to-darkRed text-white w-full flex justify-center items-center'>Admin Controls<MdAdminPanelSettings></MdAdminPanelSettings></h1>
        <h1 className='font-bold md:text-3xl lg:text-4xl m-2 relative'>See Records<GrTable className='absolute bottom-[10%] left-[103%] text-base font-semibold md:text-2xl lg:text-3xl text-center'></GrTable></h1>
        <div className='w-full flex justify-center sm:text-xl md:text-2xl'>
        <Link href={"/records/order"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Order Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/product"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Product Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/records/account"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Account Records<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        </div>
        <h1 className='font-bold md:text-3xl lg:text-4xl m-2 relative'>Insert Records<GrTableAdd className='absolute bottom-[10%] left-[103%] text-base font-semibold md:text-2xl lg:text-3xl text-center'></GrTableAdd></h1>
        <div className='w-full flex justify-center sm:text-xl md:text-2xl'>
        <Link href={"/form/order"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Order<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/form/product"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Product<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        <Link href={"/form/account"} className='bg-blue text-white p-1 m-2 hover:scale-110 rounded relative font-bold'>Account<IoMdOpen className='absolute top-0 right-0 text-sm'></IoMdOpen></Link>
        </div>
        <button type='button' onClick={handleLogout} className='m-5 font-bold sm:text-xl md:text-2xl rounded bg-blue text-white p-2 hover:scale-110'>Logout</button> */}
    </div>
    <Toaster></Toaster>
    </>
  }</>
  )
}

export default Home