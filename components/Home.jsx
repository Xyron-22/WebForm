"use client"

import React, { useEffect, useState } from 'react';
import MockData from '@/data/ProductData';
import Outlet from "@/data/OutletNameData";
import DspData from '@/data/DspData';
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
    //state for address based on DSP assigned
    const [arrayOfAddress, setArrayOfAddress] = useState()
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
      const newArr = Outlet.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setOutletArray(newArr)
    }
    
    //function for setting the date
    const onSetDate = (event) => {
      setDate(new Date(event.target.value))
  }

    //function for showing addresses based on DSP assigned
    useEffect(() => {
      switch (dspAssigned) {
        case "DSP 1": setArrayOfAddress(DspData.dsp1)
        break;
        case "DSP 2": setArrayOfAddress(DspData.dsp2)
        break;
        case "DSP 3": setArrayOfAddress(DspData.dsp3)
        break;
        case "DSP 4": setArrayOfAddress(DspData.dsp4)
        break;
        case "DSP 5": setArrayOfAddress(DspData.dsp5)
        break;
      }
    }, [dspAssigned])
    // const handleDSPAddresses = (e) => {
    //   e.preventDefault();
      
    // }
    
    console.log(dspAssigned)

  return (
    <>
    <div className='flex-col flex items-center lg:w-[80%]'>
      <h1 className='m-10 text-xl text-center md:text-2xl'>WESTERN BROTHERS OIL AND LUBRICANTS INC. ORDER FORM</h1>
      <h3 className='mb-5 text-lg text-center md:text-xl'>DISTRIBUTOR SALES PERSONNEL ORDER FORM</h3>
    <input type='search' onChange={handleSearchProduct} placeholder='Search Product' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black'></input>
    <div className='w-full flex m-5 flex-wrap text-xs md:text-xl border border-black h-[20vh] overflow-auto'>
    {mockDataArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-whiteSmoke shadow hover:scale-110' key={i} name="product" type='button' value={val} onClick={(e) => {
          setToggle(!toggle);
          handleProduct(e)
          }}>
          </input>
      )
    })}
    </div>
    <p className='text-xs md:text-xl text-center mb-2'>ADDED PRODUCTS</p>
    {arrayProducts.map(({product, quantity, price}, i) => {
      return (
        <div className='text-xs md:text-xl text-center'>
          <li key={i}>Product:{product}, Quantity:{quantity}, Price:&#x20B1;{price} <button type='button' onClick={(e) => handleRemoveProductOnArray(e, product)}>REMOVE</button></li>
        </div>
      )
    })}
    <label htmlFor='date' className='mt-5 mb-2 text-xs md:text-xl text-center'>ORDER DATE</label>
    <input className='shadow bg-whiteSmoke' type='date' name='date' value={date.toLocaleDateString("en-CA")} onChange={onSetDate}></input>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2'>DSP ASSIGNED</h1>
    <div className='text-center flex'>
      <div className='m-1 flex flex-col'>
        <label htmlFor='DSP1'>DSP 1</label>
        <input type='radio' name='DSP1' value="DSP 1" checked={dspAssigned === "DSP 1"} onChange={(e) => setDspAssigned(e.target.value)}></input>
      </div>
      <div className='m-1 flex flex-col'>
        <label htmlFor='DSP2'>DSP 2</label>
        <input type='radio' name='DSP2' value="DSP 2" checked={dspAssigned === "DSP 2"} onChange={(e) => setDspAssigned(e.target.value)}></input>
      </div>
      <div className='m-1 flex flex-col'>
        <label htmlFor='DSP3'>DSP 3</label>
        <input type='radio' name='DSP3' value="DSP 3" checked={dspAssigned === "DSP 3"} onChange={(e) => setDspAssigned(e.target.value)}></input>
      </div>
      <div className='m-1 flex flex-col'>
        <label htmlFor='DSP4'>DSP 4</label>
        <input type='radio' name='DSP4' value="DSP 4" checked={dspAssigned === "DSP 4"} onChange={(e) => setDspAssigned(e.target.value)}></input>
      </div>
      <div className='m-1 flex flex-col'>
        <label htmlFor='DSP5'>DSP 5</label>
        <input type='radio' name='DSP5' value="DSP 5" checked={dspAssigned === "DSP 5"} onChange={(e) => setDspAssigned(e.target.value)}></input>
      </div>
    </div>
    <h1 className='text-xs md:text-xl text-center mt-5 mb-2'>OUTLET NAME</h1>
    <input type='search' onChange={handleSearchOutletName} placeholder='Search Outlet Name' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black'></input>
    <div className='w-full flex m-5 flex-wrap text-xs md:text-xl border border-black h-[20vh] overflow-auto'>
    {outletArray.map((val, i) => {
      return (
          <input className='h-[25%] m-1 md:m-2 hover:cursor-pointer bg-whiteSmoke shadow hover:scale-110' key={i} name="product" type='button' value={val} onClick={() => setOutlet(val)}>
          </input>
      )
    })}
    </div>
    <h1 className='text-xs md:text-xl text-center mb-2'>ADDED OUTLET</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-whiteSmoke shadow p-2'>{outlet}</h1>
    <h1 className='text-xs md:text-xl text-center mb-2'>CUSTOMER NAME</h1>
    <h1 className='text-xs md:text-xl text-center mb-2 bg-whiteSmoke shadow p-2'>{customerName}</h1>
    <input type='text' placeholder='Enter Customer name' className='text-xs md:text-xl xl:text-xl mt-5 text-center border border-black' onChange={(e) => setCustomerName(e.target.value)}></input>
    <h1 className='text-xs md:text-xl text-center mb-2'>ADDRESS</h1>
    {arrayOfAddress && arrayOfAddress.map((address, i) => {
      return (
        <div key={i}>{address}</div>
      )
    })}
    {toggle && <Modal setToggle={setToggle} toggle={toggle} product={product} handleProduct={handleProduct} setProduct={setProduct} setArrayProducts={setArrayProducts} arrayProducts={arrayProducts}></Modal>}
    </div>
    </>
  )
}

export default HomePage





{/* <input name='quantity' className='border-black' type={toggle ? "number" : "hidden"} onChange={handleProduct}></input> <input onChange={handleProduct} name='price' type={toggle ? "number" : "hidden"}></input>
<button type='submit' onClick={handleArrayProducts}>Submit</button> */}