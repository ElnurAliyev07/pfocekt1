'use client'

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

// Icons
import Close from '@/layouts/default/components/ui/icons/Close';
import Menu from '@/layouts/default/components/ui/icons/Menu';
import Key from '@/layouts/dashbaord/components/ui/icons/Key';
import Logout from '../icons/Logout';
import AxesTop from '@/components/ui/icons/AxesTop';
import AxesBottom from '@/components/ui/icons/AxesBottom';

// Data
import { Menus } from '@/layouts/dashbaord/data/menuData';

// Hooks
import useLogout from '@/hooks/useLogout';
import { Config } from '@/types/config.type';
import Notification from '@/components/common/notification/Notification';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAuth } from '@/providers/AuthProvider';
import Profile from '../profile/Profile';

interface MobileHeaderProps {
    notifications?: number;
    config?: Config
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
    config,
    notifications = 0 
}) => {
    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    const [url, setUrl] = useState<string>("");
    const { logout } = useLogout();
    const menuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const {user} = useAuth();
    
    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [menuRef, userMenuRef]);


    // Set the active menu based on current URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            setUrl(path);
            
            // Find and set active menu if current URL matches a submenu item
            const menuWithActiveSubmenu = Menus.find(menu => 
                menu.submenu?.some(sub => sub.href === path)
            );
            
            if (menuWithActiveSubmenu) {
                setActiveMenu(menuWithActiveSubmenu.title);
            }
        }
    }, []);

    // Toggle menu and handle navigation
    const toggleMenu = (title: string, href: string | null, submenu?: { title: string, href: string, icon?: any }[] | null) => {
        if (!href && submenu && submenu.length > 0) {
            // Toggle submenu visibility
            setActiveMenu(activeMenu === title ? null : title);
        } else if (href) {
            // Navigate to the link
            router.push(href);
            setUrl(href);
            setOpen(false);
            
            // Only close active submenu if the clicked item doesn't have a submenu
            if (!submenu) {
                setActiveMenu(null);
            }
        }
    };

    // Menu animations
    const menuVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };
    
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } }
    };
    
    const userMenuVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
    };
    
    return (
        <div className="fixed lg:hidden top-0 left-0 w-full z-50">
            
            {/* Header Bar */}
            <div className="bg-white border-b border-gray-100 backdrop-blur-sm h-[60px] flex items-center justify-between px-4 shadow-md">
                {/* Left side - Menu & Logo */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setOpen(!open)} 
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 text-gray-700 shadow-sm hover:shadow"
                        aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
                    >
                        {open ? <Close /> : <Menu />}
                    </button>
                    
                    <Link href="/dashboard" className="flex items-center py-1">
                        <div className="relative group">
                            <Image
                                className="h-[32px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                                width={125}
                                height={40}
                                src={config?.logo || '/grid.png'}
                                alt="Taskfries Logo"
                                priority
                            />
                        </div>
                    </Link>
                </div>
                
                {/* Right side - Notifications & User */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className='lg:hidden'>
                        { user && (
                            <Notification/>
                        )}
                    </div>
                    <Profile/>
                </div>
            </div>

            {/* Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={backdropVariants}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Slide-out Menu */}
            <motion.div 
                ref={menuRef}
                initial="hidden"
                animate={open ? "visible" : "hidden"}
                variants={menuVariants}
                className="fixed top-0 left-0 w-[270px] h-screen bg-white shadow-xl z-50 flex flex-col overflow-hidden"
            >
                {/* Close button and logo at the top */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <Link href="/dashboard" className="flex items-center">
                        <Image
                            className="h-[32px] w-auto object-contain"
                            width={125}
                            height={40}
                            src={config?.logo || '/grid.png'}
                            alt="Taskfries Logo"
                            priority
                        />
                    </Link>
                    <button 
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Menyunu bağla"
                    >
                        <Close />
                    </button>
                </div>

                {/* Menu items */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 max-h-[calc(100vh-200px)]">
                    <nav>
                        <ul className="space-y-1">
                            {Menus.map((menu) => (
                                <li key={menu.title}>
                                    {/* Main menu item */}
                                    <div
                                        onClick={() => {
                                            if (!menu.isDisabled) {
                                                toggleMenu(menu.title, menu.href, menu.submenu);
                                            }
                                        }}
                                        className={`
                                            ${(activeMenu === menu.title || url === menu.href || (menu.submenu && menu.submenu.some(sub => sub.href === url))) ? "bg-[#E8E9FF] text-primary" : "hover:bg-gray-50"} 
                                            ${menu.isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}
                                            p-2 gap-x-[14px] flex rounded-lg items-center justify-between mt-2 transition-all duration-150 hover:shadow-sm
                                        `}
                                    >
                                        <div className="flex items-center">
                                            {menu.icon && (
                                                <div className="flex justify-center items-center w-8 h-8 rounded-md bg-white/80 shadow-sm mr-2">
                                                    <menu.icon className={`${(activeMenu === menu.title || url === menu.href || (menu.submenu && menu.submenu.some(sub => sub.href === url))) 
                                                        ? 'stroke-primary' 
                                                        : 'stroke-t-black'}`} />
                                                </div>
                                            )}
                                            <span className="font-medium text-sm">{menu.title}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1">
                                            {menu.isDisabled && (
                                                                <Key />
                                            )}
                                            {menu.submenu && (
                                                <div className="flex items-center">
                                                    {activeMenu === menu.title ? <AxesTop /> : <AxesBottom />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Submenu */}
                                    <AnimatePresence>
                                        {activeMenu === menu.title && menu.submenu && (
                                            <motion.ul 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden px-[12px] bg-white/60 backdrop-blur-sm rounded-lg my-1 py-1 border border-gray-100 shadow-sm"
                                            >
                                                {menu.submenu.map((sub) => (
                                                    <li key={sub.title}>
                                                        <button 
                                                            onClick={() => toggleMenu(sub.title, sub.href)} 
                                                            className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all
                                                                ${url === sub.href 
                                                                    ? 'text-primary bg-[#E8E9FF]/50 font-medium' 
                                                                    : 'hover:bg-gray-50 text-gray-700'}
                                                                my-0.5 flex items-center group
                                                            `}
                                                        >
                                                            {sub.icon && (
                                                                <div className={`flex justify-center items-center w-6 h-6 rounded-md ${url === sub.href ? 'bg-primary/10' : 'bg-gray-50'} mr-2.5 group-hover:bg-gray-100 transition-colors`}>
                                                                    <sub.icon className={`${url === sub.href ? 'stroke-primary' : 'stroke-t-black'} w-5 h-5`} />
                                                                </div>
                                                            )}
                                                            <p className={`
                                                                ${url === sub.href ? 'text-primary' : 'text-gray-700'} text-sm
                                                            `}>
                                                                {sub.title}
                                                            </p>
                                                        </button>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                
                {/* Logout button - moved up */}
                <div className="px-4 py-3 border-t border-gray-100">
                    <button 
                        onClick={() => logout()} 
                        className="flex items-center gap-x-[14px] rounded-md py-2 cursor-pointer text-sm w-full hover:bg-gray-50 transition-colors"
                    >
                        <Logout />
                        <p className="origin-left font-medium text-custom-red">Çıxış</p>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MobileHeader;
