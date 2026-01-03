import React from 'react'
import Notifications from '../components/Notifications'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
        <TabMenu />

        <div className='grid grid-cols-2 gap-[32px] mt-[56px]'>
            <Notifications title='Əməliyyat Bildirişləri' notifications={['Ödəniş təsdiqi', 'Xidmət tələbləri', 'Ödəniş çekləri']} />
            <Notifications title='İstifadəçi Bildirişləri' notifications={['Profil tamamlama', 'Rəylər və Sorğu tələbləri', 'Təkliflər']} />
            <Notifications title='Sistem Bildirişləri' notifications={['Yeniliklər', 'Təhlükəsizlik bildirişləri']} />
        </div>
    </div>
  )
}

export default page