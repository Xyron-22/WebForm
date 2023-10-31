import React from 'react'
import OrderRecord from '@/components/OrderRecord'

//function for fetching all the account records (runs on the server before sending files and data to client)
async function getOrderRecords () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/order`, {cache: 'no-store'})
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }
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