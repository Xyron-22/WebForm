import './globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='min-h-screen w-full'>
        <header className='min-h-[7vh] bg-whiteSmoke flex flex-wrap justify-center items-center'>
          <Header></Header>
        </header>
        <div className='h-full w-full bg-petron bg-cover bg-center'>
        <main className="min-h-[86vh] bg-black bg-opacity-50">
          {children}
        </main>
        </div>
        <footer className='min-h-[7vh] bg-whiteSmoke flex flex-wrap justify-center items-center'>
          <Footer></Footer>
        </footer>
        </body>
    </html>
  )
}
