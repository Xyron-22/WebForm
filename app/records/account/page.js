import React from 'react'
import AccountRecord from '@/components/AccountRecord'

async function getAccountRecords () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/account`)
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