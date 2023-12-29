"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import toast, {Toaster} from "react-hot-toast"
import Navbar from './Navbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import {renderActiveShapeOrders, renderActiveShapeSales, monthTickFormatter, renderQuarterTick} from "../utils/chartFunctions"
import {Tooltip as ReactToolTip} from 'react-tooltip'
import {RiArrowUpDoubleFill, RiArrowDownDoubleFill} from "react-icons/ri"
import {HiMiniInformationCircle} from "react-icons/hi2"
import {GiHamburgerMenu} from "react-icons/gi"

const Home = () => {

    const router = useRouter()

    const token = useStore((state) => state.token)
    
    const [isLoading, setIsLoading] = useState(true)

    const [orderData, setOrderData] = useState({
      months: [],
      year: {
        orders: 0,
        products: 0,
        sales: 0,
        outlets: 0
      },
      currentMonth: {
        year_date: "",
        total_orders: 0,
        total_products: 0,
        total_sales: 0,
        outlet_numbers: 0
      },
      previousMonth: {
        date: "",
        orders: 0,
        products: 0,
        sales: 0,
        outlets: 0
      },
      dspData: [],
      productData: [],
      accountData: []
    })

    const [toggleNavbar, setToggleNavbar] = useState(false)

    const [topFiveProducts, setTopFiveProducts] = useState([])
    const [topFiveAccounts, setTopFiveAccounts] = useState([])

    const [colors, setColors] = useState(['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#413ea0'])

    const [state, setState] = useState({
      activeIndex: 0,
    }
    ) 
  
    const onPieEnter = (_, index) => {
      setState({
        activeIndex: index,
      });
    };

    //function for fetching order data needed for analytics
    const fetchAllOrderData = async () => {
        try {
          const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order/data`)
          setOrderData(data.data)
          const productTempArr = [...data.data.productData]
          productTempArr.splice(5)
          setTopFiveProducts(productTempArr)
          const accountTempArr = [...data.data.accountData]
          accountTempArr.splice(5)
          setTopFiveAccounts(accountTempArr)
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            duration: 3000,
            className: "text-2xl"
          })
        }
    }

    //function for calculating the percentage of changes from previos month
    const compareToPreviousMonth = (currentMonthData, previousMonthData) => {
      if (orderData.previousMonth) {
        if (previousMonthData === 0) {
          return 100
        } else {
          return (currentMonthData * 100) / previousMonthData - 100
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

    const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`top${index + 1}-${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (<>{
    isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
     <div className='w-full bg-petron rounded flex flex-wrap'>
      <Navbar toggleNavbar={toggleNavbar} setToggleNavbar={setToggleNavbar}></Navbar>
      <div className={`bg-dark h-full w-full md:w-[85%] flex flex-col justify-evenly overflow-hidden ${toggleNavbar ? "hidden" : "inline"}`}>
        <div className='w-full flex flex-wrap justify-evenly'>
          <GiHamburgerMenu className='font-bold m-auto min-w-[12%] text-4xl rounded bg-medium border-[1px] border-light text-lightText md:hidden' onClick={() => setToggleNavbar(!toggleNavbar)}/>          
          <div id='orders' className='min-w-[80%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold my-2 mr-2 md:m-2 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>ORDERS AND OUTLETS</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold mx-1 mb-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL ORDERS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total orders this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#0088FE]'>{orderData?.year?.orders}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH ORDERS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total orders this month"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#0088FE]'>{orderData?.currentMonth?.total_orders}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders).toFixed(2)) || 0}%
              </span>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL OUTLETS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total outlets ordered this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF8042]'>{orderData?.year?.outlets}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH OUTLETS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total outlets ordered this month"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF8042]'>{orderData?.currentMonth?.outlet_numbers}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets).toFixed(2)) || 0}%
              </span>
          </div>
          <h1 className='m-auto w-full text-lightText font-bold text-center'>ORDERS AND OUTLETS EVERY MONTH</h1>
          <div className='w-full min-h-[35vh] text-xs xs:w-[95%] lg:max-w-[88%] lg:min-h-[45vh] xl:min-h-[45vh] border-[1px] border-light bg-medium rounded my-1'>
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
          <Bar dataKey="outlets" fill="#FF8042" />
       </BarChart>
      </ResponsiveContainer>
      </div>
        </div>
        <div className='w-full flex flex-wrap justify-evenly'>        
          <div id='volume' className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 mb-2 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>VOLUME AND PRODUCTS</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold mx-1 mb-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL VOLUME<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total volume this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#A4D8D8]'>{orderData?.year?.orders}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH VOLUME<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total volume this month"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#A4D8D8]'>{orderData?.currentMonth?.total_orders}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders).toFixed(2)) || 0}%
              </span>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL PRODUCTS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total quantity of products ordered this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF6961]'>{orderData?.year?.products}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH PRODUCTS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total quantity of products ordered this month"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#FF6961]'>{orderData?.currentMonth?.total_products}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_products, orderData?.previousMonth?.products).toFixed(2)) || 0}%
              </span>
          </div>
          <h1 className='m-auto w-full text-lightText font-bold text-center'>VOLUME AND PRODUCTS EVERY MONTH</h1>
          <div className='w-full min-h-[35vh] text-xs xs:w-[95%] lg:max-w-[88%] lg:min-h-[45vh] xl:min-h-[45vh] border-[1px] border-light bg-medium rounded my-1'>
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
          <Bar dataKey="orders" fill="#A4D8D8" />
          <Bar dataKey="products" fill="#FF6961" />
       </BarChart>
      </ResponsiveContainer>
      </div>
        </div>
      <div className='w-full flex flex-wrap justify-evenly'>
          <div id='sales' className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>SALES</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base w-full flex justify-between'>TOTAL SALES<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total sales this year"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#8884d8]'>&#x20B1;{orderData?.year?.sales}</p>
          </div>
          <div className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText m-1 flex flex-col flex-wrap rounded p-2'>
            <h1 className='text-xs md:text-base font-semibold w-full flex justify-between'>CURRENT MONTH SALES<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Total sales this month"/></h1>
            <h1 className='text-[0.7rem] md:text-xs'>{new Date(orderData?.currentMonth?.year_date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <p className='m-auto text-3xl md:text-5xl font-bold text-[#8884d8]'>&#x20B1;{orderData?.currentMonth?.total_sales}</p>
            <span className={`text-base md:text-xl lg:text-2xl flex font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales)) !== -1 ? "text-lightGreen": "text-red"}`}>
                {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_sales, orderData?.previousMonth?.sales).toFixed(2)) || 0}%
              </span>
          </div>
          <h1 className='m-auto w-full text-lightText font-bold text-center'>SALES EVERY MONTH</h1>
        <div className='w-full min-h-[35vh] text-xs xs:max-w-[95%] lg:max-w-[88%] lg:min-h-[45vh] xl:min-h-[45vh] border-[1px] border-light rounded bg-medium my-1'>
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
        <div className='w-full flex flex-wrap justify-evenly'>
          <div id='dsp' className='min-w-[95%] md:min-w-[95%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold m-1 flex flex-col flex-wrap rounded p-2'>
            <p className='m-auto md:text-xl font-bold'>DISTRIBUTOR SALES PERSONNEL</p>
          </div>
            <div className='w-full flex flex-col md:flex-row text-xs xs:m-auto xs:max-w-[95%] lg:max-w-[88%]'>
          <div className='flex flex-col w-full md:min-w-[67%] lg:min-w-[57%] border-[1px] border-light rounded bg-medium my-1'>
        <h1 className=' text-lightText font-bold text-center mt-2 mx-2 flex justify-between'>TOTAL ORDERS AND SALES PER DSP<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="DSP stats for whole year"/></h1>
        <h1 className='text-[0.7rem] md:text-xs mx-2 text-lightText'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
        <div className='h-[42vh] xs:h-[38vh] text-[0.6rem] lg:text-base lg:max-w-[100%] md:h-[27vh] lg:h-[40vh]'>
        <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={state.activeIndex}
            activeShape={renderActiveShapeOrders}
            data={orderData.dspData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            dataKey="total_orders"
            onMouseEnter={onPieEnter}
          />
          <Pie
            activeIndex={state.activeIndex}
            activeShape={renderActiveShapeSales}
            data={orderData.dspData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={85}
            fill="#0088FE"
            dataKey="total_sales"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
        </div>
        </div>
        <div className='flex flex-col w-full my-1 md:ml-2 m-auto flex-wrap overflow-auto z-[999999999]'>
          <div className='overflow-auto max-h-[35vh] md:max-h-[32vh] lg:max-h-[55vh]'>
            {orderData?.dspData?.map((dsp, i) => {
              return (
                <div key={i} className='min-w-[95%] xs:min-w-[45%] md:min-w-[40%] min-h-[10%] bg-medium border-[1px] border-light text-lightText font-semibold flex flex-col flex-wrap rounded p-2'>
                  <h1 className='text-xs md:text-base w-full flex justify-between'>{dsp.name}<p className='text-[0.7rem] md:text-xs text-lightText'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</p></h1>
                  <p className='mx-2 text-xs md:text-base xl:text-xl font-bold text-lightText'>Orders: <span className='text-[#0088FE]'>{dsp?.total_orders}</span></p>
                  <p className='mx-2 text-xs md:text-base xl:text-xl font-bold text-lightText'>Sales: <span className='text-[#8884d8]'>&#x20B1;{dsp?.total_sales}</span></p>
                </div>
              )
            })}
        </div>
        </div>
        </div>
        </div>
        <div id='products/accounts' className='min-w-full m-auto my-2 xs:min-w-[95%] min-h-[2%] bg-medium border-[1px] border-light text-lightText font-semibold text-center rounded p-2'>
            <p className='md:text-xl font-bold'>PRODUCTS AND ACCOUNTS</p>
        </div>
        <div className='w-full my-1 flex flex-col md:flex-row text-xs xs:mx-auto xs:h-[50vh] xs:max-w-[95%] md:h-[28vh] lg:h-[38vh] lg:max-w-[88%]'>
          <div className='w-full h-[20vh] md:min-w-[67%] md:h-[28vh] lg:h-[38vh] lg:min-w-[57%] border-[1px] border-light rounded bg-medium mb-1 text-lightText overflow-auto'>
            <table className='w-full z-[9999999]'>
              <thead>
                <tr>
                  <th className='border border-black bg-red text-white'>Top</th>
                  <th className='border border-black bg-red text-white'>Product</th>
                  <th className='border border-black bg-red text-white'>Orders</th>
                  <th className='border border-black bg-red text-white'>Sales</th>
                </tr>
              </thead>
              <tbody>
                {orderData?.productData?.map((product, i) => {
                  return (
                    <tr key={i}>
                      <td className={`border border-light text-white`}>{i + 1}</td>
                      <td className={`border border-light text-white`}>{product?.name}</td>
                      <td className='border border-light text-white'>{product?.total_orders}</td>
                      <td className='border border-light text-white'>&#x20B1;{product?.total_sales}</td>
                    </tr>
                  )
                })}            
              </tbody>
            </table>
          </div>
          <div className='flex flex-col w-full bg-medium border-[1px] border-light text-lightText rounded md:ml-2'>
          <h1 className='w-full text-center flex justify-between px-2 pt-2 font-bold'>TOP FIVE PRODUCTS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Top five products based on sales"/></h1>
          <h1 className='text-[0.7rem] md:text-xs pl-2'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
          <div className='w-full h-[30vh] md:h-[23vh] lg:h-[30vh]'>
          <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            data={topFiveProducts}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total_sales"
          >
            {orderData?.productData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />              
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
          </div>
          </div>
        </div>
        <div className='w-full flex flex-col md:flex-row text-xs xs:mx-auto xs:h-[50vh] xs:max-w-[95%] md:h-[28vh] lg:h-[38vh] lg:max-w-[88%]'>
          <div className='w-full h-[20vh] md:h-[28vh] lg:h-[38vh] md:min-w-[67%] lg:min-w-[57%] border-[1px] border-light rounded bg-medium mb-2 md:mb-0 text-lightText overflow-auto'>
            <table className='w-full z-[9999999]'>
              <thead>
                <tr>
                  <th className='border border-black bg-red text-white'>Top</th>
                  <th className='border border-black bg-red text-white'>Account</th>
                  <th className='border border-black bg-red text-white'>Orders</th>
                  <th className='border border-black bg-red text-white'>Sales</th>
                </tr>
              </thead>
              <tbody>
                {orderData?.accountData?.map((account, i) => {
                  return (
                    <tr key={i}>
                  <td className='border border-light text-white'>{i + 1}</td>
                  <td className='border border-light text-white'>{account?.name}</td>
                  <td className='border border-light text-white'>{account?.total_orders}</td>
                  <td className='border border-light text-white'>&#x20B1;{account?.total_sales}</td>
                </tr>
                  )
                })}
               </tbody>
            </table>
          </div>
          <div className='flex flex-col w-full bg-medium border-[1px] border-light text-lightText rounded md:ml-2'>
          <h1 className='w-full text-center flex justify-between pt-2 px-2 font-bold'>TOP FIVE ACCOUNTS<HiMiniInformationCircle className='text-lg md:text-xl lg:text-2xl' data-tooltip-id="my-tooltip" data-tooltip-content="Top five accounts based on sales"/></h1>
          <h1 className='text-[0.7rem] md:text-xs pl-2'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</h1>
            <div className='w-full h-[30vh] md:h-[23vh] lg:h-[30vh]'>
          <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            data={topFiveAccounts}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total_sales"
          >
            {orderData?.accountData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />              
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
          </div>
          </div>
          
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