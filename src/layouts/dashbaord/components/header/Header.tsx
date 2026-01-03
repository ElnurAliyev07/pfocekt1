'use client'

import React, { useState, useEffect } from 'react'
import SkeletonProfile from '../profile/SkeletonProfile';
import Profile from '../profile/Profile';
import {
  HiSearch,
} from "react-icons/hi";
import SearchModal from '../modals/SearchModal';
import Notification from '../../../../components/common/notification/Notification';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAuth } from '@/providers/AuthProvider';

const Header = () => {
    const [searchModalOpen, setSearchModalOpen] = useState(false);


    return (
        <div className='hidden lg:flex justify-end w-full'>
            {/* Left section with search */}
            <div className="flex items-center">
                <button
                    onClick={() => setSearchModalOpen(true)}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    aria-label="Search"
                >
                    <HiSearch className="w-6 h-6" />
                </button>
            </div>
            
            {/* Right section with notifications and profile */}
            <div className='flex items-center gap-[20px]'>
                {/* Notifications dropdown */}
                <div className='hidden lg:block'>
                    <Notification/>
                </div>                
                {/* User profile */}
                <div className='flex items-center gap-[12px]'>
                    <Profile/>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
            />
        </div>
    );
};

export default Header;
