"use client"

import React, { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useStore from '@/stateManagement/store'
import ReactLoading from "react-loading"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import toast, {Toaster} from "react-hot-toast"
import Image from 'next/image'
import Orders from '@/data/Orders'
import Records from '@/data/Records'
import Forms from '@/data/Forms'
import Analytics from '@/data/Analytics'
import NavListMenu from './NavListMenu'
import DrawerNav from './DrawerNav';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,} from 'recharts';
import {renderActiveShapeOrders, renderActiveShapeSales, monthTickFormatter, renderQuarterTick} from "../utils/chartFunctions"
import {Tooltip as ReactToolTip} from 'react-tooltip'
import {RiArrowUpDoubleFill, RiArrowDownDoubleFill} from "react-icons/ri"
import { MdArrowForwardIos, MdOutlineLogout } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {HiMiniInformationCircle} from "react-icons/hi2"
import {GiHamburgerMenu} from "react-icons/gi"
import { 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  IconButton,
  Button,
  Carousel
 } from '@material-tailwind/react'
import westernBrothersLogo from "@/public/logo/westernBrothersLogo.jpg"

const TABLE_HEAD = ["DSP", "SALES", "ORDERS"]
const PRODUCT_TABLE_HEAD = ["TOP", "PRODUCT", "NO. OF ORDERS", "SALES"]
const ACCOUNT_TABLE_HEAD = ["TOP", "ACCOUNT", "NO. OF ORDERS", "SALES"]

const Home = () => {

  const router = useRouter()

    const token = useStore((state) => state.token)

    const setTokenToNull = useStore((state) => state.setTokenToNull)
    
    const [isLoading, setIsLoading] = useState(true)
    const [errorInformation, setErrorInformation] = useState("")
    const [openDrawer, setOpenDrawer] = useState(false)

    const [orderData, setOrderData] = useState({
      months: [],
      year: {
        paid_orders: 0,
        orders: 0,
        paid_products: 0,
        products: 0,
        paid_sales: 0,
        sales: 0,
        outlets: 0,
        paid_volume: 0,
        volume: 0
      },
      currentMonth: {
        year_date: "",
        total_paid_orders: 0,
        total_orders: 0,
        total_paid_products: 0,
        total_products: 0,
        total_paid_sales: 0,
        total_sales: 0,
        outlet_numbers: 0,
        paid_order_volume: 0,
        volume: 0
      },
      previousMonth: {
        date: "",
        paid_orders: 0,
        orders: 0,
        paid_products: 0,
        products: 0,
        paid_sales: 0,
        sales: 0,
        outlets: 0,
        paid_volume: 0,
        volume: 0
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

    const handleLogout = () => {
      Cookies.remove("jwt")
      setTokenToNull()
      router.replace("/auth/login")
    }
  
    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        
        fetchAllOrderData()
        setIsLoading(false)        
    },[router, token])

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


  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <div className='w-full h-[9vh] bg-white flex justify-between items-center px-4'>
      <Image src={westernBrothersLogo} alt='image logo' height={100} width={200} className='w-auto h-[300%]'></Image>
      <div className='hidden md:flex'>
        <NavListMenu data={Orders} heading={"Orders"}></NavListMenu>
        <NavListMenu data={Records} heading={"Records"}></NavListMenu>
        <NavListMenu data={Forms} heading={"Forms"}></NavListMenu>
        <NavListMenu data={Analytics} heading={"Analytics"}></NavListMenu>
        <Button size='sm' variant='gradient' color='deep-orange' className='m-auto flex items-center' onClick={handleLogout}>
            <MdOutlineLogout className='text-xl'></MdOutlineLogout>
            SIGN OUT
        </Button>
      </div>
    </div>
    <div className='w-full min-h-[82vh] rounded-none flex items-center flex-wrap bg-dark'>
      <div className='sticky z-50 top-0 w-full px-6 pt-2 flex justify-between md:hidden'>
        <IconButton size='lg' variant='gradient' className='p-2 rounded-full bg-black text-white ' onClick={() => setOpenDrawer(true)}>
          <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
        </IconButton>
        <div>
        <SpeedDial placement='bottom'>
          <SpeedDialHandler>
            <IconButton size="lg" variant='gradient' className="rounded-full bg-black">
              <FaPlus className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent className='flex flex-col bg-black rounded-lg'>
           {Analytics.map(({page, route}, index) => {
              return (
                <SpeedDialAction className='font-bold bg-black border-none text-lightText' key={index}>
                <Link href={route}>{page}</Link>
                </SpeedDialAction>
              )
           })}
          </SpeedDialContent>
        </SpeedDial>
      </div> 
      </div>
      <Card className='w-full lg:w-[50%] h-full bg-dark' id='orders'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex justify-between bg-dark">
          <Typography variant='h5' className='text-lightText'>Number of booked orders vs paid orders</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
            <div id='chart-data-information' className='w-full lg:w-[30%] flex justify-evenly lg:flex-col text-center'>
              <div className='w-[50%] lg:w-full bg-light'>
                <Typography variant='h5' className='text-[#77DD77] bg-medium m-1'>Paid Orders</Typography>
                  <div className='m-1'>     
                  <Typography variant='h6'>Current Month</Typography>                
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_orders, orderData?.previousMonth?.paid_orders)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_orders, orderData?.previousMonth?.paid_orders)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_paid_orders, orderData?.previousMonth?.paid_orders).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#77DD77] break-words'>{orderData?.currentMonth?.total_paid_orders}</Typography>
                  </div>
                  <div className='m-1'>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h6' className='m-auto font-bold overflow-auto'>{orderData?.year?.paid_orders}</Typography>
                  </div>
              </div>
              <div className='break-words w-[50%] lg:w-full bg-light'>
                <Typography variant='h5' className='text-[#0088FE] bg-medium m-1'>Booked Orders</Typography>
                  <div className='bg-light m-1'>
                    <Typography variant='h6'>Current Month</Typography>
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_orders, orderData?.previousMonth?.orders).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#0088FE] break-words'>{orderData?.currentMonth?.total_orders}</Typography>
                  </div>
                  <div>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h6' className='m-auto font-bold overflow-auto'>{orderData?.year?.orders}</Typography>
                  </div>
              </div>
            </div>
            <div id='chart' className='w-full lg:min-w-[70%] rounded my-1 h-[35vh] lg:h-auto text-black'>
              <ResponsiveContainer style={{fill: "black"}}>
                  <BarChart
                    width={500}
                    height={600}
                    data={orderData?.months}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false}/>
                    <XAxis dataKey="date" tickFormatter={monthTickFormatter} tick={{fill: "white"}}/>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={renderQuarterTick}
                      height={1}
                      scale="band"
                    />
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="paid_orders" stackId="a" fill="#77DD77"/>
                    <Bar dataKey="orders" stackId="a" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </CardBody>
      </Card>
      <Card className='w-full lg:w-[50%] h-full bg-dark' id='volume-products'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex justify-between bg-dark">
          <Typography variant='h5' className='text-lightText'>Volume and No. of products from paid orders</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
            <div id='chart-data-information' className='w-full lg:w-[30%] flex justify-evenly lg:flex-col text-center'>
              <div className='w-[50%] lg:w-full bg-light'>
                <Typography variant='h5' className='text-[#A4D8D8] bg-medium m-1'>Volume</Typography>
                  <div className='m-1'>     
                  <Typography variant='h6'>Current Month</Typography>                
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.paid_order_volume, orderData?.previousMonth?.paid_volume)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.paid_order_volume, orderData?.previousMonth?.paid_volume)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.paid_order_volume, orderData?.previousMonth?.paid_volume).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#A4D8D8] break-words'>{orderData?.currentMonth?.paid_order_volume}</Typography>
                  </div>
                  <div className='m-1'>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h6' className='m-auto font-bold overflow-auto'>{orderData?.year?.paid_volume}</Typography>
                  </div>
              </div>
              <div className='break-words w-[50%] lg:w-full bg-light'>
                <Typography variant='h5' className='text-[#FF6961] bg-medium m-1'>Products</Typography>
                  <div className='bg-light m-1'>
                    <Typography variant='h6'>Current Month</Typography>
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_products, orderData?.previousMonth?.paid_products)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_products, orderData?.previousMonth?.paid_products)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_paid_products, orderData?.previousMonth?.paid_products).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#FF6961] break-words'>{orderData?.currentMonth?.total_paid_products}</Typography>
                  </div>
                  <div>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h6' className='m-auto font-bold overflow-auto'>{orderData?.year?.paid_products}</Typography>
                  </div>
              </div>
            </div>
            <div id='chart' className='w-full lg:min-w-[70%] rounded my-1 h-[35vh] lg:h-auto text-black'>
              <ResponsiveContainer style={{fill: "black"}}>
                  <BarChart
                    width={500}
                    height={600}
                    data={orderData?.months}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false}/>
                    <XAxis dataKey="date" tickFormatter={monthTickFormatter} tick={{fill: "white"}}/>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={renderQuarterTick}
                      height={1}
                      scale="band"
                    />
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="paid_volume" fill="#A4D8D8"/>
                    <Bar dataKey="paid_products" fill="#FF6961" />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </CardBody>
      </Card>
      <Card className='w-full lg:w-[50%] h-full bg-dark' id='outlets'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex justify-between bg-dark">
          <Typography variant='h5' className='text-lightText'>Number of outlets visited</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
            <div id='chart-data-information' className='w-full lg:w-[30%] flex justify-evenly lg:flex-col text-center'>
              <div className='w-full bg-light'>
                <Typography variant='h5' className='text-[#FF8042] bg-medium m-1'>Outlets</Typography>
                  <div className='m-1'>     
                  <Typography variant='h6'>Current Month</Typography>                
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.outlet_numbers, orderData?.previousMonth?.outlets).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#FF8042] overflow-auto'>{orderData?.currentMonth?.outlet_numbers}</Typography>
                  </div>
                  <div className='m-1'>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h3' className='m-auto font-bold overflow-auto'>{orderData?.year?.outlets}</Typography>
                  </div>
              </div>
            </div>
            <div id='chart' className='w-full lg:min-w-[70%] rounded my-1 h-[35vh] lg:h-auto text-black'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
               width={500}
                height={400}
                data={orderData?.months}
                margin={{
                  top: 0,
                  right: 25,
                  left: 5,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false} />
                <XAxis dataKey="date" tick={{fill: "white"}}/>
                <Tooltip />
                <Area type="monotone" dataKey="outlets" stroke="#FF8042" fill="#FF8042" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
        </CardBody>
      </Card>
      <Card className='w-full lg:w-[50%] h-full bg-dark' id='sales'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex justify-between bg-dark">
          <Typography variant='h5' className='text-lightText'>Sales from paid orders</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
            <div id='chart-data-information' className='w-full lg:w-[30%] flex justify-evenly lg:flex-col text-center'>
              <div className='w-full bg-light'>
                <Typography variant='h5' className='text-[#8884d8] bg-medium m-1'>Sales</Typography>
                  <div className='m-1'>     
                  <Typography variant='h6'>Current Month</Typography>                
                    <Typography variant='h6' className={`flex justify-center overflow-auto font-bold ${Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_sales, orderData?.previousMonth?.paid_sales)) !== -1 ? "text-lightGreen": "text-red"}`}>
                    {Math.sign(compareToPreviousMonth(orderData?.currentMonth?.total_paid_sales, orderData?.previousMonth?.paid_sales)) !== -1 ? <RiArrowUpDoubleFill/> : <RiArrowDownDoubleFill/>}
                    {Math.abs(compareToPreviousMonth(orderData?.currentMonth?.total_paid_sales, orderData?.previousMonth?.paid_sales).toFixed(2)) || 0}%
                    </Typography>
                    <Typography variant='h3' className='m-auto font-bold text-[#8884d8] overflow-auto'>&#8369;{(orderData?.currentMonth?.total_paid_sales).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                  </div>
                  <div className='m-1'>
                    <Typography variant='h6'>Current Year</Typography>
                    <Typography variant='h3' className='m-auto font-bold overflow-auto'>&#8369;{(orderData?.year?.paid_sales).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                  </div>
              </div>
            </div>
            <div id='chart' className='w-full lg:min-w-[70%] rounded my-1 h-[35vh] lg:h-auto text-black'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
               width={500}
                height={400}
                data={orderData?.months}
                margin={{
                  top: 0,
                  right: 25,
                  left: 5,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false} />
                <XAxis dataKey="date" tick={{fill: "white"}}/>
                <Tooltip />
                <Area type="monotone" dataKey="paid_sales" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
        </CardBody>
      </Card>
      <Card className='w-full lg:w-[100%] h-full bg-dark' id='dsp'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex flex-col items-start bg-dark">
          <Typography variant='h5' className='text-lightText'>DSP sales and order data</Typography>
          <Typography variant='h6' className='text-lightText'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
              <Carousel id='chart-data-information' className='w-full bg-light lg:hidden flex justify-evenly text-center'>
                {orderData?.dspData?.map(({name, total_sales, total_orders}, index) => {
                  return (
                    <div className='w-full h-full mb-10' key={index}>
                    <Typography variant='h5' className='text-[#8884d8] bg-medium m-1'>{name}</Typography>
                      <div className='m-1'>     
                        <Typography variant='h6'>Sales</Typography>
                        <Typography variant='h3' className='m-auto font-bold text-[#8884d8] overflow-auto'>&#8369;{(total_sales)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
                      </div>
                      <div className='m-1'>
                        <Typography variant='h6'>Orders</Typography>
                        <Typography variant='h3' className='m-auto font-bold text-[#8884d8] overflow-auto'>{total_orders}</Typography>
                      </div>
                  </div>
                  )
                })}             
              </Carousel>
              <div className='w-[50%] hidden lg:inline bg-light'>
                <Card className="h-full w-full overflow-auto rounded-none">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head, index) => (
                          <th
                            key={index}
                            className="bg-medium p-4"
                          >
                            <Typography
                              variant="small"
                              className="font-normal leading-none text-lightText"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='bg-light text-lightText'>
                      {orderData?.dspData?.map(({ name, total_sales, total_orders }, index) => {
                        const isLast = index === orderData.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                        return (
                          <tr key={index}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                &#8369;{(total_sales)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {total_orders}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
              <div id='chart' className='w-full lg:w-[50%] rounded my-1 h-[35vh] lg:h-auto text-black'>
              <ResponsiveContainer style={{fill: "black"}}>
                  <BarChart
                    width={500}
                    height={600}
                    data={orderData?.dspData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false}/>
                    <XAxis dataKey="name" tickFormatter={monthTickFormatter} tick={{fill: "white"}}/>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={renderQuarterTick}
                      height={1}
                      scale="band"
                    />
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="total_sales" fill="#8884d8"/>
                    <Bar dataKey="total_orders" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </CardBody>
      </Card>
      <Card className='w-full h-full bg-dark' id='product'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex flex-col items-start bg-dark">
          <Typography variant='h5' className='text-lightText'>Product data based on paid orders</Typography>
          <Typography variant='h6' className='text-lightText'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
              <div id='chart-data-information' className='w-full lg:w-[60%] bg-light h-[35vh] lg:h-[40vh] xl:h-[35vh]'>
                <Card className="w-full h-full overflow-auto rounded-none bg-light">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {PRODUCT_TABLE_HEAD.map((head, index) => (
                          <th
                            key={index}
                            className="bg-medium p-4"
                          >
                            <Typography
                              variant="small"
                              className="font-normal leading-none text-lightText"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='bg-light text-lightText'>
                      {orderData?.productData?.map(({ name, total_sales, total_orders }, index) => {
                        const isLast = index === orderData.productData.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                        return (
                          <tr key={index}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {index + 1}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {total_orders}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                &#8369;{(total_sales)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
              <div id='chart' className='rounded my-1 w-full flex flex-col items-center text-black h-[35vh] lg:h-[40vh] xl:h-[35vh] lg:w-[40%]'>
              <ResponsiveContainer style={{fill: "black"}}>
              <PieChart width={500} height={500}>
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
        </CardBody>
      </Card>
      <Card className='w-full h-full bg-dark' id='account'>
        <CardHeader floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none text-center p-3 flex flex-col items-start bg-dark">
          <Typography variant='h5' className='text-lightText'>Account data based on paid orders</Typography>
          <Typography variant='h6' className='text-lightText'>{new Date(orderData?.months[0]?.date).toLocaleDateString()} to {new Date(Date.now()).toLocaleDateString()}</Typography>
        </CardHeader>
        <CardBody className='w-full flex flex-col lg:flex-row p-2 bg-dark text-lightText rounded-b'>
              <div id='chart-data-information' className='w-full lg:w-[60%] bg-light h-[35vh] lg:h-[40vh] xl:h-[35vh]'>
                <Card className="w-full h-full overflow-auto rounded-none bg-light">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {ACCOUNT_TABLE_HEAD.map((head, index) => (
                          <th
                            key={index}
                            className="bg-medium p-4"
                          >
                            <Typography
                              variant="small"
                              className="font-normal leading-none text-lightText"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='bg-light text-lightText'>
                      {orderData?.accountData?.map(({ name, total_sales, total_orders }, index) => {
                        const isLast = index === orderData.accountData.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                        return (
                          <tr key={index}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {index + 1}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                {total_orders}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal"
                              >
                                &#8369;{(total_sales)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
              <div id='chart' className='rounded my-1 w-full flex flex-col items-center text-black h-[35vh] lg:h-[40vh] xl:h-[35vh] lg:w-[40%]'>
              <ResponsiveContainer style={{fill: "black"}}>
              <PieChart width={500} height={500}>
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
        </CardBody>
      </Card>
    </div>
    <div className='w-full h-[9vh] bg-white flex justify-center items-center text-center px-4'>
      <Typography variant='h6'>Property Of Western Brothers INC. • Developed By XU Software Services</Typography>
    </div>
      <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </>}</>
}</>
  )
}

export default Home