import React from 'react'

const Modal = ({setToggle, toggle, product, handleProduct, setProduct, arrayProducts, setArrayProducts}) => {

    const closeModal = (e) => {
        e.preventDefault();
        setProduct({
            product: "",
            quantity: "",
            price: ""
        })
        setToggle(!toggle)
    }

    const handleArrayProducts = (e) => {
        e.preventDefault();
        if(product.quantity !== "" && product.price !== "") {
            setArrayProducts([...arrayProducts, product])
            closeModal(e)
        } 
      }
      
    const handleRemove = (e) => {
        e.preventDefault();
        let tempArrayOfProducts = arrayProducts
        tempArrayOfProducts = tempArrayOfProducts.filter((prod) => {
            return prod.product !== product.product
        })
        setArrayProducts(tempArrayOfProducts)
    }
  

  return (
    <div className='bg-black opacity-90 z-50 absolute w-full h-full flex justify-center items-center'>
        <div className='w-full md:w-[60%] h-[40%] rounded-xl bg-white opacity-100 flex justify-center items-center flex-col'>
            <h1>{product.product}</h1>
            <div>
                <div className='flex flex-row justify-between m-5'>
                <label htmlFor='price'>PRICE:</label>
                <input name='price' type='number' placeholder='1' onChange={handleProduct} required></input>
                </div>
            <div className='flex flex-row justify-between m-5'>
            <label htmlFor='quantity'>QUANTITY:</label>
            <input name='quantity' type='number' placeholder='1' onChange={handleProduct} required></input>
            </div>
            </div>
            <div className='w-[40%] flex justify-between'>
                <button type='button' onClick={(e) => {
                    handleArrayProducts(e)
                }}>ADD</button>
                <button type='button' onClick={(e) => {
                    handleRemove(e)
                    closeModal(e)
                }}>REMOVE</button>
            </div>
            <button className='m-10' type='button' onClick={closeModal}>CLOSE</button>
        </div>
    </div>
  )
}

export default Modal