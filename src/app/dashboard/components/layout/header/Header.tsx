'use client'

import React from 'react'
import Notification from '../../ui/icons/Notification'
import Profile from '../../common/profile/Profile'

const Header = () => {

    return (
        <div className='flex justify-end'>
            <div className='flex items-center gap-[20px]'>
                <Notification />
                <div className='flex items-center gap-[12px]'>
                    <Profile/>
                </div>
            </div>
        </div>
    );
};

export default Header;
