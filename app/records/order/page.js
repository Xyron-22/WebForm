import React from 'react'
import OrderRecord from '@/components/OrderRecord'

async function getOrderRecords () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`, {cache: 'no-store'})
    return res.json()  
}

const OrderRecordPage = async () => {
    const data = await getOrderRecords()
 
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <OrderRecord data={data}></OrderRecord>
    </div>
  )
}

export default OrderRecordPage