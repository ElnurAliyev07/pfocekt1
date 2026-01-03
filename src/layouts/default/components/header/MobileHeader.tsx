"use client";

import Image from "next/image";
import React, { useState } from "react";

import { navItems } from "../../data/menuData";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Config } from "@/types/config.type";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/ui/dropdown/Dropdown";
import {
  HiLogout,
  HiUser,
  HiMenu,
  HiX,
  HiUserAdd,
  HiChevronRight,
  HiSearch,
  HiBell,
  HiClock,
} from "react-icons/hi";
import useLogout from "@/hooks/useLogout";
import Notification from "@/components/common/notification/Notification";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useAuth } from "@/providers/AuthProvider";


interface HeaderProps {
  config: Config;
  showLogin?: boolean;
  showRegister?: boolean;
}

const MobileHeader: React.FC<HeaderProps> = ({
  showLogin = true,
  showRegister = true,
  config,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: number;
    title: string;
    description: string;
    type: 'task' | 'project' | 'user';
  }>>([]);

  const { user } = useAuth();

  const handleLogout = () => {
    logout("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Simüle edilmiş arama sonuçları
      setSearchResults([
        {
          id: 1,
          title: "Proje Yönetimi",
          description: "Taskfries proje yönetim sistemi",
          type: 'project'
        },
        {
          id: 2,
          title: "Kullanıcı Arayüzü Tasarımı",
          description: "UI/UX geliştirme görevi",
          type: 'task'
        },
        {
          id: 3,
          title: "Ahmet Yılmaz",
          description: "UI/UX Designer",
          type: 'user'
        }
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
      case 'task':
        return <HiClock className="w-5 h-5 text-blue-500" />;
      case 'project':
        return <HiMenu className="w-5 h-5 text-green-500" />;
      case 'user':
        return <HiUser className="w-5 h-5 text-purple-500" />;
      default:
        return <HiSearch className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[1000] bg-[#FAFFFD] border-b border-[#C6C6C6] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/">
            <Image
              className="object-cover h-[40px] w-auto"
              width={120}
              height={40}
              src={config.logo || "/grid.png"}
              alt="logo"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <HiSearch className="w-6 h-6" />
            </button>

            <div className="lg:hidden">
              {
                  user &&  (
                    <Notification/>
                  )
              }
            </div>
            
            {/* Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Modal */}
        {searchModalOpen && (
          <div 
            className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSearchModalOpen(false)}
          >
            <div 
              className="absolute top-0 left-0 right-0 bg-white shadow-lg animate-in slide-in-from-top duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
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
                <div className="max-h-[60vh] overflow-y-auto">
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
                          <div className="mt-1">
                            {getResultIcon(result.type)}
                          </div>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute top-0 right-0 w-[280px] h-full bg-white shadow-xl animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-4 h-[72px] border-b border-gray-100/80">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    className="h-8 w-auto"
                    width={120}
                    height={32}
                    src={config.logo || "/grid.png"}
                    alt="logo"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="px-4 py-2">
                <ul className="divide-y divide-gray-100/80">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <button
                        onClick={() => {
                          router.push(item.href);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left py-3 px-2 flex items-center gap-3 group transition-all duration-200 ${
                          pathname === item.href
                            ? "text-primary font-medium"
                            : "text-gray-700 hover:text-primary"
                        }`}
                      >
                        <span className="relative">
                          {item.label}
                          {pathname === item.href && (
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                          )}
                        </span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <HiChevronRight className="w-5 h-5" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Auth Buttons - Only show when user is not logged in */}
                {!user && (
                  <div className="py-4 flex flex-col gap-3">
                    {showLogin && (
                      <button
                        onClick={() => {
                          router.push("/login");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium 
                          hover:bg-gray-50 active:bg-gray-100 transition-all duration-200
                          flex items-center justify-center gap-2 group"
                      >
                        <HiUser className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Daxil ol
                      </button>
                    )}
                    {showRegister && (
                      <button
                        onClick={() => {
                          router.push("/register");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium 
                          hover:bg-primary/90 active:bg-primary/80 transition-all duration-200
                          flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
                      >
                        <HiUserAdd className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Qeydiyyat
                      </button>
                    )}
                  </div>
                )}

                {/* User Actions - Only show when user is logged in */}
                {user && (
                  <div className="py-4 border-t border-gray-100/80">
                    <div className="px-2 py-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20">
                          <Image
                            src={
                              user.user_profile?.image ||
                              "/placeholder-avatar.png"
                            }
                            alt={user.full_name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.full_name || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/dashboard/settings/profile");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-3 px-2 text-gray-700 hover:text-primary 
                        transition-all duration-200 flex items-center gap-3 group"
                    >
                      <HiUser className="w-5 h-5 transition-transform group-hover:scale-110" />
                      Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-3 px-2 text-red-600 hover:text-red-700 
                        transition-all duration-200 flex items-center gap-3 group"
                    >
                      <HiLogout className="w-5 h-5 transition-transform group-hover:scale-110" />
                      Çıxış
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default MobileHeader;
