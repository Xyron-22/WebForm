import React from 'react'
import AboutAccount from '@/components/AboutAccount'

const AboutAccountPage = ({params}) => {
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
        <AboutAccount params={params}></AboutAccount>
    </div>
  )
}

export default AboutAccountPage