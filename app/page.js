import Image from 'next/image'
import { headers } from 'next/headers'
import Home from '@/components/Home'

export default function HomePage() {
  const headersList = headers()
  const referer = headersList.get("authorization")
  
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <Home></Home>
    </div>
  )
}
