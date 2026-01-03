'use client';

import React, { useState, useEffect, useRef } from 'react';
import AxesBottom from '../icons/AxesBottom';
import nextConfig from '../../../../../../next.config';
import { updateURLParam } from '@/utils/urlUtils';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';


const LanguageSwitcher: React.FC = () => {
  const { language: selectedLanguage, setLanguage: setSelectedLanguage } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const handleChange = async (language: string): Promise<void> => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
    updateURLParam("lang", language);
    await fetch("/api/cookie/language", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language }),
    });
    router.refresh(); // Sayfayı yeniler

    // Yeni URL'ye yönlendirme
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      {
        selectedLanguage ? (
          <div ref={dropdownRef} className="hidden relative text-t-black font-medium leading-[24px] md:flex items-center">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-2 py-1 bg-transparent text-t-black border-none rounded-sm hover:bg-gray-100 transition-all flex items-center gap-[4px]"
            >
              <span className='uppercase'>{selectedLanguage}</span>
              {
                !isDropdownOpen ? (
                  <AxesBottom />
                ) : (
                  <div className='rotate-180'>
                    <AxesBottom />
                  </div>
                )
              }
            </button>
            {isDropdownOpen && (
              <ul className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-sm shadow-md">
                {nextConfig.i18n?.locales.map((language) => (
                  <li key={language}>
                    <button
                      onClick={() => handleChange(language)}
                      className={`w-full text-left px-4 py-2 uppercase hover:bg-gray-100 transition-all ${selectedLanguage === language ? 'font-bold' : ''
                        }`}
                    >
                      {language}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        ) : (
          <div className='hidden md:flex gap-[12px]'>
          </div>
        )
      }

      <div className='md:hidden grid grid-cols-3 gap-[12px] w-full'>
        {nextConfig.i18n?.locales.map((language, index) => (
          <button
            key={index}
            onClick={() => handleChange(language)}
            className={`h-[27px] rounded-[6px] text-[10px] uppercase ${selectedLanguage === language ? 'text-white bg-primary' : 'text-t-black bg-custom-gray'
              }`}
          >
            {language}
          </button>
        ))}
      </div>
    </>
  );
};

export default LanguageSwitcher;
