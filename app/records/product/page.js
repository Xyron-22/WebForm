import React from 'react'
import ProductRecord from '@/components/ProductRecord'

async function getProductRecords () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`, {cache: 'no-store'})
    return res.json()
}

const ProductPage = async () => {
    const data = await getProductRecords()
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <ProductRecord data={data}></ProductRecord>
    </div>
  )
}

export default ProductPage