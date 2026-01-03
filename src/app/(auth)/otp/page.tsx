import React from 'react'
// import LoginForm from './LoginForm'
import Image from 'next/image'
import Form from './components/Form'

const page = () => {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-primary h-full">
        <Image
          className="w-full h-full object-cover bg-[#444BD3] opacity-43"
          src="/login.jpeg"
          width={2000}
          height={2000}
          alt="Picture of the author"
        />
      </div>
      <div className="flex flex-col items-center mt-[100px]">
        <div className="w-[438px]">
          <div className='mb-[114px] flex justify-end'>
            <Image
              className="w-[159px]"
              src="/logo.png"
              width={2000}
              height={2000}
              alt="Logo"
            />
          </div>
          <h1 className='text-center text-t-black leading-[32px] text-[24px] font-medium'>OTP kodunuzu daxil edin</h1>
          <p className='mt-[8px] mb-[56px] text-center text-t-gray leainding-[24px]'>Kodunuz mailinizə göndərilib.</p>
          
          <Form/>
        </div>
      </div>
    </div>
  )
}

export default page