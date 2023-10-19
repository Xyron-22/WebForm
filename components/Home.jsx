"use client"

import React, { useEffect, useState } from 'react';
import MockData from '@/data/ProductData';
import Outlet from "@/data/OutletNameData";
import DspAddresses from '@/data/DspAddresses';
import DspData from '@/data/DspData';
import TermsData from '@/data/TermsData';
import Modal from './Modal';

const HomePage = () => {
  //state for single product
    const [product, setProduct] = useState({
      product: "",
      quantity: "",
      price: ""
    })
    //state for the initial array of products
    const [mockDataArray, setMockDataArray] = useState(MockData)
    //state for the initial array of outlet names
    const [outletArray, setOutletArray] = useState(Outlet)
    //state for array of products added
    const [arrayProducts, setArrayProducts] = useState([])
    //state for DSP Assigned
    const [dspAssigned, setDspAssigned] = useState("")
    //state for outlet name selected
    const [outlet, setOutlet] = useState("")
    //state for customer name
    const [customerName, setCustomerName] = useState("")
    //state for array of address shown based on DSP assigned
    const [arrayOfAddressShown, setArrayOfAddressShown] = useState()
    //state for array of address to search against, initial array of address based on dsp
    const [arrayOfAddressToSearchAgainst, setArrayOfAddressToSearchAgainst] = useState()
    //state for address
    const [address, setAddress] = useState("")
    //state for tin number
    const [tinNumber, setTinNumber] = useState("")
    //state for contact number
    const [contactNumber, setContactNumber] = useState("")
    //state for term
    const [term, setTerm] = useState("")
    //state for toggling the modal
    const [toggle, setToggle] = useState(false)
    
    //getting the date today
    let defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate())

    //state for initial date value 
    const [date, setDate] = useState(defaultDate)

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
      const newArr = MockData.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setMockDataArray(newArr)
    }
    
    //function for searching products in the lists of products
    const handleSearchOutletName = (e) => {
      const newArr = Outlet.filter((outlet) => outlet.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setOutletArray(newArr)
    }
    
    //function for setting the date
    const onSetDate = (event) => {
      setDate(new Date(event.target.value))
  }

    //function for searching address
    const handleSearchAddress = (e) => {
      const newArr = arrayOfAddressToSearchAgainst.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setArrayOfAddressShown(newArr)
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
    <div className='flex-col flex items-center lg:w-[80%] bg-white shadow-2xl'>
      <h1 className='m-10 text-xl text-center md:text-2xl'>WESTERN BROTHERS OIL AND LUBRICANTS INC. ORDER FORM</h1>
      <h3 className='mb-5 text-lg text-center md:text-xl'>DISTRIBUTOR SALES PERSONNEL ORDER FORM</h3>
    <label htmlFor='date' className='mt-5 mb-2 text-xs md:text-xl text-center bg-[#ffcccb] p-1 rounded'>ORDER DATE</label>
    <input className='shadow bg-whiteSmoke' type='date' name='date' value={date.toLocaleDateString("en-CA")} onChange={onSetDate}></input>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2 bg-[#FFD580] p-1 rounded'>DSP ASSIGNED</h1>
    <div className='text-center flex'>
      {DspData.map((dsp, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <label htmlFor={dsp}>{dsp}</label>
          <input type='radio' name={dsp} value={dsp} checked={dspAssigned === dsp} onChange={(e) => setDspAssigned(e.target.value)}></input>
        </div>
        )
      })}
    </div>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2 bg-[#CBC3E3] p-1 rounded'>OUTLET NAME</h1>
    <input type='search' onChange={handleSearchOutletName} placeholder='Search Outlet Name' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-xs md:text-xl border border-black h-[20vh] overflow-auto'>
    {outletArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-[#CBC3E3] rounded p-1 shadow hover:scale-110' key={i} name="product" type='button' value={val} onClick={() => setOutlet(val)}>
          </input>
      )
    })}
    </div>
    <h1 className='text-xs md:text-xl text-center mb-2'>ADDED OUTLET</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-whiteSmoke shadow p-2'>{outlet}</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-[#ADD8E6] p-1 rounded'>CUSTOMER NAME</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-[#ADD8E6] rounded shadow p-2'>{customerName}</h1>
    <input type='text' placeholder='Enter Customer name' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black' onChange={(e) => setCustomerName(e.target.value)}></input>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2 bg-[#C4A484] p-1 rounded'>ADDRESS</h1>
    <input type='search' onChange={handleSearchAddress} placeholder='Search Address' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-xs md:text-xl border border-black h-[20vh] overflow-auto'>
    {arrayOfAddressShown && arrayOfAddressShown.map((address, i) => {
      return (
        <input type='button' className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-[#C4A484] rounded p-1 shadow hover:scale-110' value={address} onClick={(e) => setAddress(e.target.value)} key={i}></input>
      )
    })}
    </div>
    <h1 className='text-xs md:text-xl text-center mb-2'>ADDED ADDRESS</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-whiteSmoke shadow p-2'>{address}</h1>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2 bg-[#D3D3D3] p-1 rounded'>TIN NUMBER AND CONTACT NUMBER</h1>
    <div className='text-center flex flex-col lg:flex-row'>
      <label htmlFor='TIN' className='text-xs md:text-xl text-center m-1'>TIN NUMBER:</label>
      <input name='TIN' type='text' className='text-xs md:text-xl xl:text-xl text-center border border-black' onChange={(e) => setTinNumber(e.target.value)}></input>
      <label htmlFor='Contact' className='text-xs md:text-xl text-center m-1'>CONTACT NUMBER:</label>
      <input name='Contact' type='text' className='text-xs md:text-xl xl:text-xl text-center border border-black' onChange={(e) => setContactNumber(e.target.value)}></input>
    </div>
    <h1 className='text-xs md:text-xl text-center mb-2 mt-5 bg-[#FFC0CB] p-1 rounded'>TERMS</h1>
    <div className='text-center flex'>
      {TermsData.map((termValue, i) => {
        return (
          <div className='m-1 flex flex-col' key={i}>
          <label htmlFor={termValue}>{termValue}</label>
          <input type='radio' name={termValue} value={termValue} checked={term === termValue} onChange={(e) => setTerm(e.target.value)}></input>
        </div>
        )
      })}
    </div>
    <h1 className='text-xs md:text-xl text-center mb-2 mt-5 bg-lightGreen p-1 rounded'>PRODUCTS</h1>
    <input type='search' onChange={handleSearchProduct} placeholder='Search Product' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black'></input>
    <div className='w-[95%] flex m-5 flex-wrap text-xs md:text-xl border border-black h-[20vh] overflow-auto'>
    {mockDataArray.map((val, i) => {
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
    <h1 className='text-xs md:text-xl text-center mb-2'>ADDED PRODUCTS</h1>
    {arrayProducts.map(({product, quantity, price}, i) => {
      return (
        <div className='text-xs md:text-xl text-center'>
          <li key={i}>Product:{product}, Quantity:{quantity}, Price:&#x20B1;{price} <button type='button' onClick={(e) => handleRemoveProductOnArray(e, product)}>REMOVE</button></li>
        </div>
      )
    })}
    </div>
    {toggle && <Modal setToggle={setToggle} toggle={toggle} product={product} handleProduct={handleProduct} setProduct={setProduct} setArrayProducts={setArrayProducts} arrayProducts={arrayProducts}></Modal>}
    </div>
    </>
  )
}

export default HomePage