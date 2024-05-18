"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { 
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
   } from '@material-tailwind/react'
import {IoChevronDown} from 'react-icons/io5'

   function NavListMenu({data, heading}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
   
    const renderItems = data.map(({ page, description, icon, route }, index) => (
      <Link href={route} key={index}>
        <MenuItem className='flex items-center'>
        <div className='mr-1 text-6xl'>
            {icon}
        </div>
        <div>
        <Typography variant="h6" color="blue-gray" className="mb-1">
            {page}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {description}
          </Typography>
        </div>
        </MenuItem>
      </Link>
    ));
    return (
      <React.Fragment>
        <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
          <MenuHandler>
            <Typography variant="small" className="font-normal">
              <MenuItem className="hidden items-center gap-1 font-bold text-blue-gray-900 md:flex md:rounded-full px-1 lg:px-3">
                {heading}
                <IoChevronDown></IoChevronDown>
              </MenuItem>
            </Typography>
          </MenuHandler>
          <MenuList className="hidden w-[20rem] grid-cols-6 gap-3 overflow-visible md:grid">
            <ul className="col-span-6 flex w-full flex-col gap-1">
              {renderItems}
            </ul>
          </MenuList>
        </Menu>
      </React.Fragment>
    );
  }

export default NavListMenu