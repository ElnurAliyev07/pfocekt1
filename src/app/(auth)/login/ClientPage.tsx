'use client'

import React from "react";
import LoginForm from "./components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "./components/buttons/GoogleLoginButton";
import Facebook from "../register/components/ui/icons/Facebook";
import Apple from "../register/components/ui/icons/Apple";
import { useAppContext } from "@/providers/AppProvider";

const ClientPage = () => {
  const { config } = useAppContext();
  
  return (
    <main className="md:min-h-screen md:bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="md:min-h-screen lg:grid lg:grid-cols-2">
        {/* Hero section - only visible on desktop */}
        <aside className="bg-primary hidden lg:block relative overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10" />
          <Image
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src="/login.jpeg"
            width={2000}
            height={2000}
            alt="Login background"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 text-white">
            <h1 className="text-4xl font-bold mb-4">{config?.site_name}-ə Xoş Gəlmisiniz</h1>
            <p className="text-lg text-white/90">Tapşırıqlarınızı idarə etmək üçün ən yaxşı platforma</p>
          </div>
        </aside>

        {/* Login section */}
        <section className="flex flex-col justify-center items-center px-5 py-10 lg:py-0">
          <div className="w-full max-w-[420px]">
            {/* Header navigation */}
            <header className="flex justify-between items-center mb-8">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-all duration-300 group"
                aria-label="Ana Səhifə"
              >
                <span className="p-2 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
                  <svg 
                    className="w-5 h-5 transition-transform group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium">Ana Səhifə</span>
              </Link>
              <div className="flex lg:justify-end">
                {/* Logo placeholder */}
              </div>
            </header>

            {/* Login heading */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Xoş Gəlmisiniz
              </h2>
              <p className="text-gray-600">Hesabınıza daxil olun</p>
            </div>

            {/* Login form without container */}
            <div className="mb-8">
              <LoginForm />
            </div>

            {/* Social login options */}
            <div className="mb-8">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-sm font-medium text-gray-500">
                  və ya
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <button 
                  className="flex items-center justify-center h-12 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Facebook ilə daxil olun"
                >
                  <Facebook className="w-6 h-6" />
                </button>
                
                <div 
                  className="flex items-center justify-center h-12 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Google ilə daxil olun"
                >
                  <GoogleLoginButton />
                </div>
                
                <button 
                  className="flex items-center justify-center h-12 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Apple ilə daxil olun"
                >
                  <Apple className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Registration link */}
            <footer className="text-center mt-6">
              <span className="text-gray-600">Hesabınız yoxdur?</span>
              <Link 
                href="/register" 
                className="ml-2 text-primary font-medium hover:text-primary-hover transition-colors focus:outline-none focus:underline"
              >
                Qeydiyyatdan keçin
              </Link>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ClientPage;
