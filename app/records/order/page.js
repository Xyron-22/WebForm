import React from 'react'
import OrderRecord from '@/components/OrderRecord(current)'

const OrderRecordPage = async () => {
 
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <OrderRecord></OrderRecord>
    </div>
  )
}

export default OrderRecordPage