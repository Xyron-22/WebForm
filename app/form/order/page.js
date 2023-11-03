import React from 'react'
import OrderForm from '@/components/OrderForm'

async function getProductRecords () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`, {cache: 'no-store'})
  return res.json()
}

const OrderPage = async () => {
  const data = await getProductRecords()

  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <OrderForm data={data}></OrderForm>
    </div>
  )
}

export default OrderPage