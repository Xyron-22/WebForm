// import '../../app/globals.css'
// import Footer from '@/components/Footer'
// import Header from '@/components/Header'

// export const metadata = {
//   title: 'WesternBrothers',
//   description: 'Data Management System',
//   icons: {
//     icon: "/logo/oil-drop-logo.png"
//   }
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className='scroll-smooth'>
//         <body className='min-h-screen min-w-screen'>
//         <header className='min-h-[7vh] bg-whiteSmoke flex flex-wrap justify-center items-center'>
//           <Header></Header>
//         </header>
//         <div className='h-full min-w-full bg-petron bg-cover bg-center'>
//         <main className="min-h-[86vh] bg-black bg-opacity-50 relative">
//           {children}
//         </main>
//         </div>
//         <footer className='min-h-[7vh] bg-whiteSmoke flex flex-wrap justify-center items-center'>
//           <Footer></Footer>
//         </footer>
//         </body>
//     </html>
//   )
// }
import '../../app/globals.css'
import Footer from '@/components/Footer'
import CurrentFooter from '@/components/Footer(current)'
import Header from '@/components/Header'
import CurrentHeader from "@/components/Header(current)"

export const metadata = {
  title: 'WesternBrothers',
  description: 'Data Management System',
  icons: {
    icon: "/logo/westernBrothersLogo.jpg"
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='scroll-smooth'>
        <body className='min-h-screen min-w-screen'>
        <header>
          <CurrentHeader></CurrentHeader>
        </header>
        <div className='h-full min-w-full bg-petron bg-cover bg-center'>
        <main className="min-h-[86vh] bg-black bg-opacity-50 relative">
          {children}
        </main>
        </div>
        <footer>
          <CurrentFooter></CurrentFooter>
        </footer>
        </body>
    </html>
  )
}
