"use client";

import AxesBottom from "@/components/ui/icons/AxesBottom";
import AxesTop from "@/components/ui/icons/AxesTop";
import { useState } from "react";
import { MenuItem, Menus } from "../../data/menuData";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Logout from "../icons/Logout";
import useLogout from "@/hooks/useLogout";
import Key from "../ui/icons/Key";
import Link from "next/link";
import PageUnderConstruction from "@/components/common/modals/PageUnderConstruction";
import { Config } from "@/types/config.type";
import SidebarBtn from "../ui/buttons/SidebarBtn";

// Define the type for props
interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  config?: Config;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, config }) => {
  const url = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  // Track manually closed menus to prevent auto-reopening
  const [manuallyClosedMenus, setManuallyClosedMenus] = useState<string[]>([]);
  const { logout } = useLogout();

  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = (
    title: string,
    href: string | null,
    submenu?: { title: string; href: string; isDisabled?: boolean }[] | null,
    isDisabled?: boolean
  ) => {
    // Eğer menu disabled ise, modal aç ve işlemi durdur
    if (isDisabled) {
      setModalOpen(true);
      return;
    }

    if (!href && submenu && submenu.length > 0) {
      if (!open) {
        // Sidebar kapalıyken, ilk submenu item'a git (disabled değilse)
        const firstActiveSubmenuItem = submenu.find((item) => !item.isDisabled);
        if (firstActiveSubmenuItem) {
          router.push(firstActiveSubmenuItem.href);
        }
      } else {
        // Sidebar açıkken submenu'yu aç/kapat
        if (activeMenu === title) {
          // Menü zaten açıksa, kapatma işlemi
          setActiveMenu(null);
          // Menü manuel olarak kapatıldığında bunu kaydet
          setManuallyClosedMenus((prev) => [...prev, title]);
        } else {
          // Menü kapalıysa, açma işlemi
          setActiveMenu(title);
          // Menü açıldığında manuel olarak kapalı listesinden çıkar
          setManuallyClosedMenus((prev) =>
            prev.filter((menu) => menu !== title)
          );
        }
      }
    } else if (href) {
      router.push(href);
      setActiveMenu(null); // Navigasyon sırasında açık submenu'yu kapat
    }
  };

  const handleSubmenuClick = (
    title: string,
    href: string,
    isDisabled?: boolean
  ) => {
    if (isDisabled) {
      setModalOpen(true);
      return;
    }
    router.push(href);
  };

  // Menu'nun aktif olup olmadığını kontrol eden yardımcı fonksiyon
  const isMenuActive = (menu: MenuItem) => {
    return (
      activeMenu === menu.title ||
      url === menu.href ||
      (menu.submenu && menu.submenu.some((sub: any) => sub.href === url))
    );
  };

  // Submenu'nun gösterilip gösterilmeyeceğini kontrol eden fonksiyon
  const shouldShowSubmenu = (menu: MenuItem) => {
    // Temel koşullar: sidebar açık olmalı, submenu olmalı ve disabled olmamalı
    if (!open || !menu.submenu || menu.isDisabled) return false;

    // Eğer menü manuel olarak kapatıldıysa, gösterme
    if (manuallyClosedMenus.includes(menu.title)) return false;

    // Durum 1: Bu menu manuel olarak açıldıysa (kullanıcı tıkladıysa)
    if (activeMenu === menu.title) return true;

    // Durum 2: Kullanıcı başka bir menüye geçtiğinde
    // Eğer hiçbir menü manuel olarak açılmamışsa (activeMenu === null)
    // ve mevcut URL bu menünün alt menülerinden birine eşitse
    // bu durumda alt menüyü otomatik olarak aç
    if (
      activeMenu === null &&
      menu.submenu.some((sub: any) => sub.href === url)
    ) {
      return true;
    }

    // Diğer durumlarda submenu'yu gösterme
    return false;
  };

  return (
    <>
      <div
        className={`hidden fixed lg:flex ${
          open ? "w-[272px]" : "w-20"
        } bg-white duration-300`}
      >
        <div className={`h-screen py-[16px] w-full pt-8 relative`}>
          <Link
            href="/dashboard"
            className="flex px-[16px] w-full gap-x-4 items-center"
            onClick={() => {
              setActiveMenu(null);
            }}
          >
            <Image
              className="w-[125px] object-cover"
              src={config?.logo || "/grid.png"}
              width={125}
              height={55}
              alt="logo"
            />
          </Link>

          {/* Simple toggle button with higher z-index */}
          <SidebarBtn open={open} setOpen={setOpen} />

          <div className="mt-[48px] px-[16px] max-h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar">
            {Menus.map((Menu, index) => (
              <div key={index}>
                <div
                  className={`${
                    isMenuActive(Menu)
                      ? "bg-[#E8E9FF] text-primary"
                      : "hover:bg-gray-200"
                  } 
                    ${open && "p-2 gap-x-[14px]"}
                    ${Menu.isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
                    flex rounded-md py-2 stroke-primary text-sm items-center ${
                      Menu.gap ? "mt-9" : "mt-2"
                    }`}
                  onClick={() => {
                    // Eğer sidebar açıksa ve aktif menüye tıklandıysa, toggle işlemi yap
                    toggleMenu(
                      Menu.title,
                      Menu.href,
                      Menu.submenu,
                      Menu.isDisabled
                    );
                  }}
                >
                  {Menu.icon && (
                    <Menu.icon
                      className={`${
                        isMenuActive(Menu) ? "stroke-primary" : "stroke-t-black"
                      } ${Menu.size || "w-[50px]"}`}
                    />
                  )}
                  <p
                    className={`${!open && "hidden"} ${
                      isMenuActive(Menu) ? "text-primary" : "text-t-gray"
                    } origin-left font-medium`}
                  >
                    {Menu.title}
                  </p>
                  <div className="flex flex-1 justify-end">
                    {Menu.submenu &&
                      open &&
                      !Menu.isDisabled &&
                      (activeMenu === Menu.title ? (
                        <AxesTop />
                      ) : (
                        <AxesBottom />
                      ))}
                  </div>
                  {Menu.isDisabled && open && <Key />}
                </div>

                {shouldShowSubmenu(Menu) && (
                  <div
                    className={`px-[12px] ${
                      index !== Menus.length - 1 && "border-b pb-2"
                    }`}
                  >
                    {Menu.submenu?.map((sub, subIndex) => (
                      <div
                        onClick={() =>
                          handleSubmenuClick(
                            sub.title,
                            sub.href,
                            sub.isDisabled
                          )
                        }
                        key={subIndex}
                        className={`${
                          sub.href === url
                            ? "text-primary"
                            : "hover:bg-gray-200"
                        } 
                        ${open && "p-2 gap-x-[14px]"} 
                        ${
                          sub.isDisabled
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } 
                        flex rounded-md p-2 hover:bg-gray-100 text-sm items-center justify-between gap-x-[14px] mt-2`}
                      >
                        <div className="flex items-center gap-x-[14px]">
                          {sub.icon && (
                            <sub.icon
                              className={`${
                                sub.href === url
                                  ? "stroke-primary"
                                  : "stroke-t-black"
                              } ${sub.size || "w-[50px]"}`}
                            />
                          )}
                          <p
                            className={`${!open && "hidden"} ${
                              sub.href === url ? "text-primary" : "text-t-gray"
                            } origin-left font-medium`}
                          >
                            {sub.title}
                          </p>
                        </div>
                        {sub.isDisabled && open && <Key />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => logout()}
            className={`${
              open && "p-2 gap-x-[14px]"
            } mt-[48px] mx-[16px] flex rounded-md py-2 cursor-pointer text-sm items-center`}
          >
            <Logout />
            <p
              className={`${
                !open && "hidden"
              } origin-left font-medium text-custom-red`}
            >
              Çıxış
            </p>
          </button>
        </div>
      </div>
      <PageUnderConstruction isOpen={modalOpen} setIsOpen={setModalOpen} />
    </>
  );
};

export default Sidebar;
