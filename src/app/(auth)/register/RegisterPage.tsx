import React from 'react'
import Image from 'next/image'
import RegisterForm from './components/RegisterForm'
import LoginBtn from './components/LoginBtn'
import Facebook from './components/ui/icons/Facebook'
import Apple from './components/ui/icons/Apple'
import GoogleLoginButton from '../login/components/buttons/GoogleLoginButton'
// import { Logo } from '../login/components/images/Logo'

const RegisterPage = () => {
  return (
    <section className="px-[16px] lg:px-0">
    <div className="min-h-screen flex flex-col lg:grid grid-cols-2">
      <div className="hidden lg:block bg-primary h-full ">
        <Image
          className="w-full h-full object-cover bg-[#444BD3] opacity-43"
          src="/login.jpeg"
          width={2000}
          height={2000}
          alt="Picture of the author"
        />
      </div>
      <div className="flex flex-col mt-[24px] lg:mt-0 items-center justify-center">
        <div className="w-full lg:w-[438px]">
          <div className='mb-[32px] flex lg:justify-end'>
            {/* <Logo/> */}
          </div>
          <RegisterForm />
          <div className="mt-[32px]">
            <div className="flex items-center justify-center">
              <div className="border-t border-borderDefault w-full"></div>
              <span className="px-4 text-t-gray whitespace-nowrap">
                və ya
              </span>
              <div className="border-t border-borderDefault w-full"></div>
            </div>
            <div className="mt-[32px] grid grid-cols-3 gap-[15px]">
              <div className="border border-borderDefault h-[56px] rounded-[8px] grid place-items-center hover:bg-gray-100">
                <Facebook />
              </div>
              <div className="border border-borderDefault h-[56px] rounded-[8px] grid place-items-center hover:bg-gray-100">
              <GoogleLoginButton/>
              </div>
              <div className="border border-borderDefault h-[56px] rounded-[8px] grid place-items-center hover:bg-gray-100">
                <Apple />
              </div>
            </div>
            <div className="mt-[48px] lg:mt-[32px] text-center">
              <span className="text-t-gray">Hesabınız var?</span>
              <LoginBtn/>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}

export default RegisterPage