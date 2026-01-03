import React from 'react'
import SecurityBox from '../components/SecurityBox'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
        
        <TabMenu />

        <div className='grid grid-cols-2 gap-[36px] mt-[56px]'>
            <SecurityBox title='Şifrə' text='Sonuncu dəfə 20 Yanvar 2022 ci il dəyişdirilib' toggle={false} />
            <SecurityBox title='İki Tərəfli Doğrulama ' text='Sonuncu dəfə 20 Yanvar 2022 ci il dəyişdirilib' toggle={true} />
            <SecurityBox title='Cihaz İdarəsi' text='Sonuncu dəfə 20 Yanvar 2022 ci il dəyişdirilib' toggle={false} />
            <SecurityBox title='Hesab Fəaliyyətləri' text='Sonuncu dəfə 20 Yanvar 2022 ci il dəyişdirilib' toggle={false} />
        </div>
    </div>
  )
}

export default page