import React from 'react'
import AccountRecord from '@/components/AccountRecord(current)'

const AccountRecordPage = async () => {
   
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <AccountRecord></AccountRecord>
    </div>
  )
}

export default AccountRecordPage