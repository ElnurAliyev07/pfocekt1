"use client"

import Search from '@/components/ui/icons/Search'
import React, { useState } from 'react'

type SearchBoxWithDropdownProps = {
    placeholder?: string;
    filters: { key: number; label: string; }[]
};

const SearchBoxWithDropdown: React.FC<SearchBoxWithDropdownProps> = ({ placeholder = 'Axtar', filters }) => {
    const [] = useState();

    return (
        <div className='flex gap-[8px] items-center border rounded-full px-4 py-2 shadow-xs bg-white'>
            <button className='text-gray-500 hover:text-gray-700 transition-colors'>
                <Search />
            </button>
            <input
                className='grow bg-transparent outline-hidden text-gray-700 placeholder-gray-400'
                type="text"
                name=""
                id=""
                placeholder={placeholder}
            />

            {/* Diger kodlarda next-ui istifade edildiyi uchun bu hisseni bele saxlamisham, daha sonra deyishdirilmelidir */}
            <select className='text-t-gray px-2 border-s-2' name="" id="">
                {filters.map((filter) => (
                    <option value="" key={filter.key}>{filter.label}</option>
                ))}
            </select>
        </div>
    )
}

export default SearchBoxWithDropdown