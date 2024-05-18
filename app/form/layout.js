import '../../app/globals.css'

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
        <div className='h-full min-w-full bg-petron bg-cover bg-center'>
        <main className="min-h-screen bg-black bg-opacity-50 relative">
          {children}
        </main>
        </div>
        </body>
    </html>
  )
}
