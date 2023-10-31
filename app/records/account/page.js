import React from 'react'
import AccountRecord from '@/components/AccountRecord'

//function for fetching all the account records (runs on the server before sending files and data to client)
async function getAccountRecords () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account`, {cache: 'no-store'})
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }
    return res.json()
}

const AccountRecordPage = async () => {
    const data = await getAccountRecords()
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <AccountRecord data={data}></AccountRecord>
    </div>
  )
}

export default AccountRecordPage