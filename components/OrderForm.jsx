"use client"

import React, { useLayoutEffect,  useState } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import useStore from '@/stateManagement/store';
import { useRouter } from 'next/navigation';
import toast, {Toaster} from "react-hot-toast";
import ReactLoading from "react-loading";
import DspData from '@/data/DspData';
import TermsData from '@/data/TermsData';
import Modal from './Modal';

const OrderForm = ({data}) => {

  const token = useStore((state) => state.token)
  // const decodedToken = useStore((state) => state.decodedToken)
   
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // ORDER DATE -----------------------------------------------------
  //getting the date today
  let defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate()) //do not rmeove

  //state for initial order date value 
  const [date, setDate] = useState(defaultDate) //do not remove

  // DSP ASSIGNED -----------------------------------------------------
  //state for DSP Assigned
  const [dspAssigned, setDspAssigned] = useState("") //do not remove

  // OUTLET NAME -----------------------------------------------------
  //state for the initial array of outlet names
  const [outletArray, setOutletArray] = useState([]) //do not remove
  const [outletArrayToSearchAgainstWith, setOutletArrayToSearchAgainstWith] = useState()
  const [accountSelected, setAccountSelected] = useState("")//do not remove
 
  // ADDRESS --------------------------------------------------------
  //state for array of address shown based on DSP assigned
  const [arrayOfAddressShown, setArrayOfAddressShown] = useState() //do not remove
  //state for array of address to search against, initial array of address based on dsp
  const [arrayOfAddressToSearchAgainst, setArrayOfAddressToSearchAgainst] = useState() //do not remove

  // PRODUCTS -------------------------------------------------------------
  //state for single product
  const [product, setProduct] = useState({
    product: "",
    productId: "",
    quantity: "",
    price: ""
  }) //do not remove
  //state for the initial array of products
  const [initialProductArray, setInitialProductArray] = useState(data.data) //do not remove
  //state for array of products added
  const [arrayProducts, setArrayProducts] = useState([]) //do not remove

  // FORM
  //state for whole form complete with all the fields
  const [form, setForm] = useState({
    orderDate: defaultDate,
    accountId: "",   
    customerName: "",
    tinNumber: "",
    contactNumber: "",
    term: "",
    products: "",
    remarksFreebiesConcern: "",
    deliveryDate: ""
  })

  console.log(form)

  // MODAL TOGGLE ------------------------------------------------------------------
  //state for toggling the modal
  const [toggle, setToggle] = useState(false)
    
    // console.log(form)
      
    //function for removing a product in the array of added products
    const handleRemoveProductOnArray = (e, prod) => {
      e.preventDefault();
      let tempArrayOfProducts = arrayProducts;
      tempArrayOfProducts = tempArrayOfProducts.filter((product) => {
        return product.product !== prod
      })
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
    
    //function for setting the date
    const onSetDate = (event) => {
      setDate(new Date(event.target.value))
      setForm({...form, orderDate: new Date(event.target.value)})
  }

    //function for searching address
    const handleSearchAddress = (e) => {
      const newArr = arrayOfAddressToSearchAgainst.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setArrayOfAddressShown(newArr)
    }

    //function for fetching account records based on dsp
    const handleFetchAccountBasedOnDsp = async (e) => {
        e.preventDefault()
        try {
          const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account/${e.target.value}`)
          setOutletArray(data.data)
          setOutletArrayToSearchAgainstWith(data.data)
          console.log(data.data)
        } catch (error) {
          console.log(error)
        }
    }

    //function for submitting the form
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(
      form.customerName !== "" 
      && form.accountId !== ""
      && form.tinNumber !== "" 
      && form.contactNumber !== "" 
      && form.term !== "" 
      && form.products !== "" 
      && form.remarksFreebiesConcern !== "" 
      && form.deliveryDate !== "") {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`, form, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          toast.success("Form submitted", {
            duration: 3000,
            className: "text-2xl"
          })
          setDspAssigned("")
          setArrayOfAddressShown([])
          setArrayProducts([])
          setForm({
          orderDate: defaultDate,
          accountId: "",
          customerName: "",
          tinNumber: "",
          contactNumber: "",
          term: "",
          products: "",
          remarksFreebiesConcern: "",
          deliveryDate: ""
      })
      e.target.reset()  
        } catch (error) {
          toast.error("Something went wrong, Please try again", {
            duration: 3000,
            className: "text-2xl"
          })
        }
      } else {
        toast.error("All fields are required", {
          duration: 3000,
          className: "text-2xl"
        })
      }
    }

    useLayoutEffect(() => {
      if (!token) return router.replace("/auth/login")
      const decodedToken = jwtDecode(token)
      if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) {
        router.replace("/auth/login")
      } else {
        setIsLoading(false)
      }
    }, [])
 
  return (
    <>
    {isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <form className='flex-col flex items-center lg:w-[80%] bg-white shadow-2xl' onSubmit={handleSubmit}>
      <h1 className='m-7 md:m-10 text-xl text-center md:text-4xl font-extrabold'>ORDER FORM</h1>
      <h3 className='mb-5 text-lg text-center md:text-2xl font-bold'>DISTRIBUTOR SALES PERSONNEL ORDER FORM</h3>
      <hr className='border-[1px] border-black w-[90%] my-3'/>
    <label htmlFor='orderDate' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-red text-white p-1 rounded font-semibold'>ORDER DATE</label>
    <input className='shadow bg-whiteSmoke text-xl md:text-2xl mb-3' type='date' name='orderDate' value={date.toLocaleDateString("en-CA")} onChange={onSetDate}></input>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-red text-white p-1 rounded font-semibold'>DSP ASSIGNED</h1>
    <div className='text-center flex'>
      {DspData.map((dsp, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <input onClick={(e) => {
            setDspAssigned(e.target.value)
            handleFetchAccountBasedOnDsp(e)
          }} type='button' value={dsp} className={`text-xl md:text-2xl ${dspAssigned === dsp ? "bg-blue text-white" : "bg-transparent"} rounded p-1 mb-1 hover:cursor-pointer`}></input>
        </div>
        )
      })}
    </div>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-red text-white p-1 rounded font-semibold'>OUTLET NAME</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{accountSelected}</h1>
    <input type='search' onChange={handleSearchOutletName} placeholder='Search Outlet Name' className='text-lg md:text-2xl mt-5 text-center border border-black rounded'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-lg md:text-2xl border border-black rounded-xl h-[20vh] overflow-auto'>
    {outletArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-blue text-white rounded p-1 shadow hover:scale-110' key={i} name="outlet" type='button' value={`${val.account_name}  ${val.location}`} onClick={(e) => {
            setAccountSelected(e.target.value)
            setForm({...form, accountId: val.account_id})
          }}>
          </input>
      )
    })}
    </div>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-red text-white p-1 rounded font-semibold'>CUSTOMER NAME</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{form.customerName}</h1>
    <input type='text' placeholder='Enter Customer name' name='customerName' val={form.customerName} className='text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => setForm({...form, customerName: e.target.value})}></input>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-red text-white p-1 rounded font-semibold'>TIN NUMBER AND CONTACT NUMBER</h1>
    <div className='text-center flex flex-col lg:flex-row mb-3'>
      <label htmlFor='TIN' className='text-lg md:text-2xl text-center m-1'>TIN NUMBER:</label>
      <input name='TIN' val={form.tinNumber} type='text' className='text-lg md:text-2xl text-center border border-black rounded' placeholder='Enter TIN' onChange={(e) => setForm({...form, tinNumber: e.target.value})}></input>
      <label htmlFor='Contact' className='text-lg md:text-2xl text-center m-1'>CONTACT NUMBER:</label>
      <input name='Contact' val={form.contactNumber} type='text' className='text-lg md:text-2xl text-center border border-black rounded' placeholder='Enter Contact' onChange={(e) => setForm({...form, contactNumber: e.target.value})}></input>
    </div>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-red text-white p-1 rounded font-semibold'>TERMS</h1>
    <div className='text-center flex'>
      {TermsData.map((termValue, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <input type='button' name="term" value={termValue} className={`${form.term === termValue ? "bg-blue text-white" : "bg-transparent"} m-1 p-1 rounded hover:cursor-pointer text-lg md:text-2xl`} onClick={(e) => setForm({...form, term: e.target.value})}></input>
        </div>
        )
      })}
    </div>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-red text-white p-1 rounded font-semibold'>PRODUCTS</h1>
    <div>
    {arrayProducts.map(({product, quantity, price}, i) => {
      return (
        <div className='text-lg md:text-2xl text-center p-2 rounded flex'>
          <li className='bg-blue text-white p-2 rounded' key={i}>Product: {product} | Quantity: {quantity} | Price: &#x20B1;{price}</li><button className='ml-3 bg-[#FF0000] text-white p-2 rounded' type='button' onClick={(e) => handleRemoveProductOnArray(e, product)}>Remove</button>
        </div>
      )
    })}
    </div>
    <input type='search' onChange={handleSearchProduct} placeholder='Search Product' className='text-lg md:text-2xl mt-5 text-center border border-black rounded'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-lg md:text-2xl border border-black rounded-xl h-[20vh] overflow-auto'>
    {initialProductArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-blue text-white shadow hover:scale-110 p-1 rounded' key={i} name="product" type='button' value={val.mat_description} onClick={(e) => {
          setToggle(!toggle);
          setProduct({
            product: val.mat_description,
            productId: val.product_id
          })
          }}>
          </input>
      )
    })}
    </div>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
     <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-red text-white p-1 rounded font-semibold'>REMARKS/FREEBIES/CONCERN</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-blue text-white rounded shadow p-2'>{form?.remarksFreebiesConcern}</h1>
    <textarea type='text' placeholder='Enter Text' name='remarksFreebiesConcern' className='w-[50%] text-lg md:text-2xl mt-5 text-center border border-black rounded mb-3' onChange={(e) => setForm({...form, remarksFreebiesConcern: e.target.value})}></textarea>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-red text-white p-1 rounded font-semibold'>DELIVERY DATE</h1>
    <input className='shadow bg-whiteSmoke mb-5 text-xl md:text-2xl' type='date' name='deliveryDate' onChange={(e) => setForm({...form, deliveryDate: e.target.value})}></input>
    <hr className='border-[1px] border-black w-[90%] my-3'/>
    <button type='submit' className='mb-5 m-2 text-lg md:text-2xl p-2 rounded bg-blue text-white font-semibold'>Submit Form</button>
    {toggle && <Modal setToggle={setToggle} toggle={toggle} product={product} setProduct={setProduct} setArrayProducts={setArrayProducts} arrayProducts={arrayProducts} form={form} setForm={setForm}></Modal>}
    </form>
    <Toaster></Toaster>
    </>}
    </>
  )
}

export default OrderForm