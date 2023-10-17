"use client"

import React, { useState } from 'react'
import MockData from '@/data/MockData';
import Modal from './Modal';

const Inputs = () => {
    const [product, setProduct] = useState({
      product: "",
      quantity: "",
      price: ""
    })
    const [mockDataArray, setMockDataArray] = useState(MockData)
    const [arrayProducts, setArrayProducts] = useState([])
    const [searchItem, setSearchItem] = useState("")
    const [toggle, setToggle] = useState(false)

    const handleProduct = (e) => {
      e.preventDefault();
      setProduct({...product, [e.target.name]: e.target.value})
    }
    
    const handleRemoveProductOnArray = (e, prod) => {
      e.preventDefault();
      let tempArrayOfProducts = arrayProducts;
      tempArrayOfProducts = tempArrayOfProducts.filter((product) => {
        return product.product !== prod
      })
      setArrayProducts(tempArrayOfProducts)
    }

    const handleSearch = (e) => {
      const newArr = MockData.filter((prod) => prod.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      setMockDataArray(newArr)
    }

  return (
    <>
    <div className='flex-col flex items-center'>
    <input type='search' onChange={handleSearch} placeholder='Search Product' className='text-xs md:text-xl xl:text-xl m-10 text-center'></input>
    <div className='flex m-5 flex-wrap justify-evenly text-xs md:text-xl xl:text-xl'>
    {mockDataArray.map((val, i) => {
      return (
          <input className='m-3 hover:cursor-pointer' key={i} name="product" type='button' value={val} onClick={(e) => {
          setToggle(!toggle);
          handleProduct(e)
          }}>
          </input>
      )
    })}
    </div>
    {arrayProducts.map(({product, quantity, price}, i) => {
      return (
          <li key={i}>Product:{product}, Quantity:{quantity}, Price:&#x20B1;{price} <button type='button' onClick={(e) => handleRemoveProductOnArray(e, product)}>REMOVE</button></li>
      )
    })}
    {toggle && <Modal setToggle={setToggle} toggle={toggle} product={product} handleProduct={handleProduct} setProduct={setProduct} setArrayProducts={setArrayProducts} arrayProducts={arrayProducts}></Modal>}
    </div>
    </>
  )
}

export default Inputs





{/* <input name='quantity' className='border-black' type={toggle ? "number" : "hidden"} onChange={handleProduct}></input> <input onChange={handleProduct} name='price' type={toggle ? "number" : "hidden"}></input>
<button type='submit' onClick={handleArrayProducts}>Submit</button> */}