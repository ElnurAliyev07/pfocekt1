import React from 'react'
import AdvantageBox from '../components/AdvantageBox'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
        <TabMenu />

        <div className='grid grid-cols-2 gap-[32px] mt-[56px]'>
            <AdvantageBox title='Yüklənmiş Fayllar' />
            <AdvantageBox title='Rəylər' />
            <AdvantageBox title='Ödənişlər' />
            <AdvantageBox title='Cüzdan' />
        </div>
    </div>
  )
}

export default page