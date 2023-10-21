"use client"

import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import ProductData from '@/data/ProductData';
import Outlet from "@/data/OutletNameData";
import DspAddresses from '@/data/DspAddresses';
import DspData from '@/data/DspData';
import TermsData from '@/data/TermsData';
import Modal from './Modal';

const HomePage = () => {

  const formData = useRef()
 
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
  const [outletArray, setOutletArray] = useState(Outlet) //do not remove
  //state for outlet name selected
   
  // CUSTOMER NAME -----------------------------------------------------
  //state for customer name
  const [customerName, setCustomerName] = useState("") //do not remove

  // ADDRESS --------------------------------------------------------
  //state for array of address shown based on DSP assigned
  const [arrayOfAddressShown, setArrayOfAddressShown] = useState() //do not remove
  //state for array of address to search against, initial array of address based on dsp
  const [arrayOfAddressToSearchAgainst, setArrayOfAddressToSearchAgainst] = useState() //do not remove
  //state for address
  const [address, setAddress] = useState("") //do not remove

  // PRODUCTS -------------------------------------------------------------
  //state for single product
  const [product, setProduct] = useState({
  product: "",
    quantity: "",
    price: ""
  }) //do not remove
  //state for the initial array of products
  const [initialProductArray, setInitialProductArray] = useState(ProductData) //do not remove
  //state for array of products added
  const [arrayProducts, setArrayProducts] = useState([]) //do not remove

  // FORM
  //state for whole form complete with all the fields
  const [form, setForm] = useState({
    orderDate: defaultDate,
    dspAssigned: "",
    outlet: "",
    customerName: "",
    address: "",
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
    

    //function for filling in the fields of a single product
    const handleProduct = (e) => {
      e.preventDefault();
      setProduct({...product, [e.target.name]: e.target.value})
    }
    
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
      const newArr = ProductData.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setInitialProductArray(newArr)
    }
    
    //function for searching products in the lists of products
    const handleSearchOutletName = (e) => {
      const newArr = Outlet.filter((outlet) => outlet.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
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

    //function for submitting the form
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(form.dspAssigned !== "" 
      && form.outlet !== "" 
      && form.customerName !== "" 
      && form.address !== "" 
      && form.tinNumber !== "" 
      && form.contactNumber !== "" 
      && form.term !== "" 
      && form.products !== "" 
      && form.remarksFreebiesConcern !== "" 
      && form.deliveryDate !== "") {
        try {
          await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/form", formData.current, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          toast.success("Form submitted", {
            duration: 3000,
            className: "text-2xl"
          })
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
      console.log(formData.current)
      setForm({
        orderDate: defaultDate,
        dspAssigned: "",
        outlet: "",
        customerName: "",
        address: "",
        tinNumber: "",
        contactNumber: "",
        term: "",
        products: "",
        remarksFreebiesConcern: "",
        deliveryDate: ""
      })
      e.target.reset()  
    }

    //function for showing addresses based on DSP assigned
    useEffect(() => {
      switch (dspAssigned) {
        case "DSP 1": setArrayOfAddressShown(DspAddresses.dsp1)
        setArrayOfAddressToSearchAgainst(DspAddresses.dsp1)
        break;
        case "DSP 2": setArrayOfAddressShown(DspAddresses.dsp2)
        setArrayOfAddressToSearchAgainst(DspAddresses.dsp2)
        break;
        case "DSP 3": setArrayOfAddressShown(DspAddresses.dsp3)
        setArrayOfAddressToSearchAgainst(DspAddresses.dsp3)
        break;
        case "DSP 4": setArrayOfAddressShown(DspAddresses.dsp4)
        setArrayOfAddressToSearchAgainst(DspAddresses.dsp4)
        break;
        case "DSP 5": setArrayOfAddressShown(DspAddresses.dsp5)
        setArrayOfAddressToSearchAgainst(DspAddresses.dsp5)
        break;
      }
    }, [dspAssigned])
 
  return (
    <>
    <form className='flex-col flex items-center lg:w-[80%] bg-white shadow-2xl' ref={formData} onSubmit={handleSubmit}>
      <h1 className='m-10 text-xl text-center md:text-3xl'>WESTERN BROTHERS OIL AND LUBRICANTS INC. ORDER FORM</h1>
      <h3 className='mb-5 text-lg text-center md:text-2xl'>DISTRIBUTOR SALES PERSONNEL ORDER FORM</h3>
      <hr className='border-2 border-black w-full my-3'/>
    <label htmlFor='orderDate' className='mt-5 mb-2 text-lg md:text-2xl text-center bg-[#ffcccb] p-1 rounded'>ORDER DATE</label>
    <input className='shadow bg-whiteSmoke text-xl md:text-2xl' type='date' name='orderDate' value={date.toLocaleDateString("en-CA")} onChange={onSetDate}></input>
    <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-[#FFD580] p-1 rounded'>DSP ASSIGNED</h1>
    <div className='text-center flex'>
      {DspData.map((dsp, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <label htmlFor="dspAssigned" className='text-xl md:text-2xl'>{dsp}</label>
          <input type='radio' name="dspAssigned" value={dsp} checked={dspAssigned === dsp} onChange={(e) => {
            setDspAssigned(e.target.value)
            setForm({...form, dspAssigned: e.target.value})
          }}></input>
        </div>
        )
      })}
    </div>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-[#CBC3E3] p-1 rounded'>OUTLET NAME</h1>
    <input type='search' onChange={handleSearchOutletName} placeholder='Search Outlet Name' className='text-lg md:text-2xl mt-5 text-center border border-black rounded'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-lg md:text-2xl border border-black rounded-xl h-[20vh] overflow-auto'>
    {outletArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-[#CBC3E3] rounded p-1 shadow hover:scale-110' key={i} name="outlet" type='button' value={val} onClick={(e) => setForm({...form, outlet: e.target.value})}>
          </input>
      )
    })}
    </div>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#CBC3E3] p-1 rounded'>ADDED OUTLET</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#CBC3E3] rounded shadow p-2'>{form?.outlet}</h1>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#ADD8E6] p-1 rounded'>CUSTOMER NAME</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#ADD8E6] rounded shadow p-2'>{customerName}</h1>
    <input type='text' placeholder='Enter Customer name' name='customerName' val={customerName} className='text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => {
      setCustomerName(e.target.value)
      setForm({...form, customerName: e.target.value})
    }}></input>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-[#C4A484] p-1 rounded'>ADDRESS</h1>
    <input type='search' onChange={handleSearchAddress} placeholder='Search Address' className='text-lg md:text-2xl mt-5 text-center border border-black rounded'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-lg md:text-2xl border border-black rounded-xl h-[20vh] overflow-auto'>
    {arrayOfAddressShown && arrayOfAddressShown.map((address, i) => {
      return (
        <input type='button' className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-[#C4A484] rounded p-1 shadow hover:scale-110' name='address' value={address} onClick={(e) => {
          setAddress(e.target.value)
          setForm({...form, address: e.target.value})
        }} key={i}></input>
      )
    })}
    </div>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#C4A484] p-1 rounded'>ADDED ADDRESS</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 shadow bg-[#C4A484] p-2 rounded'>{address}</h1>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mt-5 mb-2 bg-[#D3D3D3] p-1 rounded'>TIN NUMBER AND CONTACT NUMBER</h1>
    <div className='text-center flex flex-col lg:flex-row'>
      <label htmlFor='TIN' className='text-lg md:text-2xl text-center m-1'>TIN NUMBER:</label>
      <input name='TIN' val={form.tinNumber} type='text' className='text-lg md:text-2xl text-center border border-black rounded' placeholder='Enter TIN' onChange={(e) => setForm({...form, tinNumber: e.target.value})}></input>
      <label htmlFor='Contact' className='text-lg md:text-2xl text-center m-1'>CONTACT NUMBER:</label>
      <input name='Contact' val={form.contactNumber} type='text' className='text-lg md:text-2xl text-center border border-black rounded' placeholder='Enter Contact' onChange={(e) => setForm({...form, contactNumber: e.target.value})}></input>
    </div>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-[#FFC0CB] p-1 rounded'>TERMS</h1>
    <div className='text-center flex'>
      {TermsData.map((termValue, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <label htmlFor={termValue}>{termValue}</label>
          <input type='radio' name="term" value={termValue} checked={form?.term === termValue} onChange={(e) => setForm({...form, term: e.target.value})}></input>
        </div>
        )
      })}
    </div>
      <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-lightGreen p-1 rounded'>PRODUCTS</h1>
    <input type='search' onChange={handleSearchProduct} placeholder='Search Product' className='text-lg md:text-2xl mt-5 text-center border border-black rounded'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-lg md:text-2xl border border-black rounded-xl h-[20vh] overflow-auto'>
    {initialProductArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-lightGreen shadow hover:scale-110 p-1 rounded' key={i} name="product" type='button' value={val} onClick={(e) => {
          setToggle(!toggle);
          handleProduct(e)
          }}>
          </input>
      )
    })}
    </div>
    <div className='pb-5'>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-lightGreen p-1 rounded'>ADDED PRODUCTS</h1>
    {arrayProducts.map(({product, quantity, price}, i) => {
      return (
        <div className='text-lg md:text-2xl text-center mb-2 shadow bg-lightGreen p-2 rounded'>
          <li key={i}>Product:{product}, Quantity:{quantity}, Price:&#x20B1;{price} <button type='button' onClick={(e) => handleRemoveProductOnArray(e, product)}>REMOVE</button></li>
        </div>
      )
    })}
    </div>
    <hr className='border-2 border-black w-full my-3'/>
     <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-[#CF9FFF] p-1 rounded'>REMARKS/FREEBIES/CONCERN</h1>
    <h1 className='text-lg md:text-2xl text-center mb-2 bg-[#CF9FFF] rounded shadow p-2'>{form?.remarksFreebiesConcern}</h1>
    <textarea type='text' placeholder='Enter Text' name='remarksFreebiesConcern' className='w-[50%] text-lg md:text-2xl mt-5 text-center border border-black rounded' onChange={(e) => setForm({...form, remarksFreebiesConcern: e.target.value})}></textarea>
    <hr className='border-2 border-black w-full my-3'/>
    <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-[#808000] p-1 rounded'>DELIVERY DATE</h1>
    <input className='shadow bg-whiteSmoke mb-5 text-xl md:text-2xl' type='date' name='deliveryDate' onChange={(e) => setForm({...form, deliveryDate: e.target.value})}></input>
    <hr className='border-2 border-black w-full mt-3'/>
    <button type='submit'>submit form</button>
    {toggle && <Modal setToggle={setToggle} toggle={toggle} product={product} handleProduct={handleProduct} setProduct={setProduct} setArrayProducts={setArrayProducts} arrayProducts={arrayProducts} form={form} setForm={setForm}></Modal>}
    </form>
    <Toaster></Toaster>
    </>
  )
}

export default HomePage