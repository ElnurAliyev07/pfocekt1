import React from 'react'

const PersonalInformation = () => {

    const ChildComponent = ({ title, text }: { title: string, text: string }) => {
        return (
            <div className='flex flex-col gap-[10px] font-medium'>
                <p className='text-t-gray text-[16px] leading-[24px]'>{title}</p>
                <p className='text-t-black text-[14px] leading-[20px]'>{text}</p>
            </div>
        )
    }

  return (
    <div className='bg-white border border-[#E8EAED] px-[24px] py-[20px] rounded-[16px] font-medium'>
        <div className='flex justify-between'>
            <h3 className='text-[20px] leading-[28px] text-t-gray font-medium'>Şəxsi məlumatlar</h3>
        </div>

        <div className="grid grid-cols-2 mt-[17px]">
            <div className='flex flex-col gap-[12px]'>
                <ChildComponent title='Ad, soyad' text='Ayaz Səmədov' />
                <ChildComponent title='Ünvan' text='Bakı, Azərbaycan' />
                <ChildComponent title='Vəzifə' text='Product Designer' />
            </div>

            <div className='flex flex-col gap-[12px]'>
                <ChildComponent title='Email' text='ayazsamadov@gmail.com' />
                <ChildComponent title='Date of birth' text='09/10/2000' />
                <ChildComponent title='Cins' text='Kişi' />
            </div>
        </div>


    </div>
  )
}

export default PersonalInformation