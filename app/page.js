import Image from 'next/image'
import HomePage from '@/components/Home';

export default function Home() {
  // console.log(process.env.TEST)
  return (
    <main className="flex min-h-screen flex-col items-center bg-lightBlue">
      <HomePage></HomePage>
    </main>
  )
}
