import React from "react"
import Image from "next/image"
import westernBrothersLogo from "@/public/logo/westernBrothersLogo.jpg"

const CurrentHeader = () => {
    return (
        <div className='w-full h-[9vh] bg-white flex justify-between items-center px-4 overflow-hidden'>
            <Image src={westernBrothersLogo} alt='image logo' height={100} width={200} className='w-auto h-[300%]'></Image>
        </div>
    )
}

export default CurrentHeader
