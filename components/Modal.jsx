import React from 'react'
import toast from "react-hot-toast"

const Modal = ({setToggle, toggle, product, setProduct, arrayProducts, setArrayProducts, form, setForm}) => {

    //function for closing modal and setting the product state empty
    const closeModal = (e) => {
        e.preventDefault();
        setProduct({
            product: "",
            productId: "",
            quantity: "",
            price: ""
        })
        setToggle(!toggle)
    }
    
    //function for filling in the fields of a single product
    const handleProduct = (e) => {
        e.preventDefault();
        setProduct({...product, [e.target.name]: e.target.value})
    }

    //function for adding a product in the array of added products
    const handleAddProduct = (e) => {
        e.preventDefault();
        if(product.quantity !== "" && product.price !== "") {
            toast.success("Product Added", {
                duration: 3000,
                className: "text-2xl"
            })
            setArrayProducts([...arrayProducts, product])
            setForm({...form, products: [...arrayProducts, product]})
            closeModal(e)
        } 
      }
      
    //function for removing a product in the added products array
    const handleRemoveProduct = (e) => {
        e.preventDefault();
        let tempArrayOfProducts = arrayProducts
        tempArrayOfProducts = tempArrayOfProducts.filter((prod) => {
            return prod.product !== product.product
        })
        setArrayProducts(tempArrayOfProducts)
    }
  

  return (
    <div className='bg-black opacity-100 z-40 sticky bottom-0 w-screen h-screen flex justify-center items-center'>
        <div className='w-full md:w-[60%] h-[40%] rounded-xl bg-white opacity-100 flex justify-center items-center flex-col z-50'>
            <h1 className='text-lg md:text-2xl text-center mb-2 mt-5 bg-lightGreen p-1 rounded shadow-xl'>{product.product}</h1>
            <div>
                <div className='flex flex-row justify-between m-5'>
                <label htmlFor='price' className='text-lg md:text-2xl text-center'>Price:</label>
                <input name='price' type='number' placeholder='1' className='rounded border border-black' onChange={handleProduct} required></input>
                </div>
            <div className='flex flex-row justify-between m-5'>
            <label htmlFor='quantity' className='text-lg md:text-2xl text-center'>Quantity:</label>
            <input name='quantity' type='number' placeholder='1' className='rounded border border-black' onChange={handleProduct} required></input>
            </div>
            </div>
            <div className='w-[40%] flex justify-evenly'>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-lightGreen p-1 rounded' onClick={(e) => {
                    handleAddProduct(e)
                }}>Add</button>
                <button type='button' className='text-lg md:text-2xl shadow-xl text-center mb-2 mt-5 bg-[#FF0000] p-1 rounded' onClick={(e) => {
                    handleRemoveProduct(e)
                    closeModal(e)
                }}>Remove</button>
            </div>
            <button className='m-10 bg-lightGreen rounded shadow-xl text-lg md:text-2xl p-2' type='button' onClick={closeModal}>CLOSE</button>
        </div>
    </div>
  )
}

export default Modal