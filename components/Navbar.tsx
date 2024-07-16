import React from 'react'
import culogo from '../images/cu-logo-white.webp'
import Image from 'next/image'
import naclogo from '../images/naac-a-logo.webp'
import qslogo from '../images/qs-logo-white.webp'
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  return (
    <div className='bg-slate-600 py-5 px-4 mb-6 opacity-80 flex justify-between items-center'>
        <div className='flex gap-2'>
        <Image src={culogo} alt="logo" className='w-[110px] h-[50px] '/>
        <Image src={naclogo} alt="naaclogo" className='w-[110px] h-[50px] ' />
        <Image src={qslogo} alt="qslogo" className='w-[110px] h-[50px] ' />
        </div>

        <div className='flex items-center gap-2'>
        <MdDashboard className='text-2xl'/>
        <div className='flex text-2xl items-center'>
            <p className='text-red-600 text-4xl font-extrabold'>C</p>
            <p className='text-white'>U</p>

        </div>
        <h1 className='text-3xl text-slate-300 '>
            Dashboard
        </h1>
        </div>
        
    </div>
  )
}

export default Navbar