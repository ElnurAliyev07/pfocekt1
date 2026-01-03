"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Login from "../ui/buttons/Login";
import Register from "../ui/buttons/Register";
import { navItems } from "../../data/menuData";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Config } from "@/types/config.type";

import {
  HiLogout,
  HiUser,
  HiSearch,
  HiX,
  HiClock,
  HiMenu,
} from "react-icons/hi";
import useLogout from "@/hooks/useLogout";

import Notification from "@/components/common/notification/Notification";
import { useAuth } from "@/providers/AuthProvider";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown/Dropdown";

interface HeaderProps {
  config: Config;
  showLogin?: boolean;
  showRegister?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showLogin = true,
  showRegister = true,
  config,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // const { logout } = useLogout();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      type: "task" | "project" | "user";
    }>
  >([]);
  
  

  const { user, logout } = useAuth();


  const handleLogout = () => {
    logout("/");
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Test məlumatları (axtarış nəticələri)
      setSearchResults([
        {
          id: 1,
          title: "Layihə İdarəetməsi",
          description: "Taskfries layihə idarəetmə sistemi",
          type: "project",
        },
        {
          id: 2,
          title: "İstifadəçi İnterfeysi Dizaynı",
          description: "UI/UX inkişaf tapşırığı",
          type: "task",
        },
        {
          id: 3,
          title: "Anar Məmmədov",
          description: "UI/UX Dizayner",
          type: "user",
        },
        {
          id: 4,
          title: "Mobil Tətbiq İnkişafı",
          description: "iOS və Android üçün tətbiq",
          type: "project",
        },
        {
          id: 5,
          title: "Veb Saytın Yenilənməsi",
          description: "Şirkət saytının yenidən dizaynı",
          type: "task",
        },
        {
          id: 6,
          title: "Səidə Əliyeva",
          description: "Backend Proqramçı",
          type: "user",
        },
        {
          id: 7,
          title: "API İnteqrasiyası",
          description: "Ödəniş sisteminin inteqrasiyası",
          type: "task",
        },
        {
          id: 8,
          title: "Məlumat Bazasının Optimallaşdırılması",
          description: "Performans yaxşılaşdırılması",
          type: "project",
        },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "task":
        return <HiClock className="w-5 h-5 text-blue-500" />;
      case "project":
        return <HiMenu className="w-5 h-5 text-green-500" />;
      case "user":
        return <HiUser className="w-5 h-5 text-purple-500" />;
      default:
        return <HiSearch className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-black hidden lg:block dark:bg-secondary-dark sticky top-0 z-[1000] transition-all duration-300">
        <div className="custom-container mx-auto left-1 right-1 z-[999] absolute top-[28px] bg-[#FAFFFD] border-[#C6C6C6] border rounded-[8px] px-[23px]! h-[72px] lg:flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-[130px]">
            {/* Logo Section */}
            <Link href="/">
              <Image
                className="object-cover h-[50px] w-auto"
                width={150}
                height={50}
                src={config.logo || "/grid.png"}
                alt="hero img"
                priority
              />
            </Link>

            {/* Navigation Links */}
            <div>
              <ul className="flex gap-[24px] font-normal text-[16px] text-text-black dark:text-text-dark-black">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`${
                        pathname === item.href
                          ? "text-t-black border-primary"
                          : "text-[#64717C] border-transparent"
                      } border-b pb-[6px] hover:border-primary transition-colors duration-200`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons or User Profile */}
          <div className="flex gap-[16px] items-center">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <HiSearch className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              {user && (
                  <Notification/>
              )}
            </div>

            
              {user ? (
                <Dropdown>
                  <DropdownTrigger nested={false}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                          src={
                            user.user_profile?.image ||
                            "/placeholder-avatar.png"
                          }
                          alt={user.full_name || "User"}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.full_name || "User"}
                      </span>
                    </div>
                  </DropdownTrigger>

                  <DropdownMenu>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-center">
                        {user.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate text-center">
                        {user.email || ""}
                      </p>
                    </div>
                    <DropdownItem
                      // startContent={<HiUser className="w-4 h-4" />}
                      onClick={() => router.push("/dashboard/settings/profile")}
                    >
                      Profil
                    </DropdownItem>
                    <DropdownItem
                      // startContent={<HiLogout className="w-4 h-4" />}
                      onClick={handleLogout}
                    >
                      Çıxış
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <>
                  {showLogin && <Login />}
                  {showRegister && <Register />}
                </>
              )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-lg shadow-xl animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-gray-100">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Axtar..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoFocus
                  />
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                      aria-label="Clear search"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                  aria-label="Close search"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto">
                <div className="px-4 py-2 text-sm text-gray-500">
                  {searchResults.length} nəticə tapıldı
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        router.push(`/${result.type}s/${result.id}`);
                        setSearchModalOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getResultIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && (
              <div className="px-4 py-8 text-center">
                <HiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  "{searchQuery}" üçün nəticə tapılmadı
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
