import Image from 'next/image'
import LoginForm from '@/components/Login';

export default function Home() {
  // console.log(process.env.TEST)
  return (
    <main className="flex min-h-screen flex-col items-center bg-lightBlue">
      <LoginForm></LoginForm>
    </main>
  )
}
