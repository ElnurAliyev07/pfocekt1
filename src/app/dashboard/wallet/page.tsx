import React from 'react'
import ListOfAssets from './components/containers/ListOfAssets'
import Custom from './components/containers/Custom'
import MoneyFillPurple from './components/icons/MoneyFillPurple'
import MoneyFillCyan from './components/icons/MoneyFillCyan'
import IncreanceBalance from './components/buttons/IncreanceBalance'
import Plus from './components/icons/Plus'
import FilterSection from './components/containers/FilterSection'
import SectionWrapper from '@/components/common/wrappers/SectionWrapper'

const page = () => {
  return (
    <SectionWrapper disabled>

      <h1 className='font-medium text-xl'>Cüzdan</h1>

      <div className='flex justify-between my-8'>
        {/* Containers */}
        <div className='flex gap-8'>
          <Custom Icon={<MoneyFillPurple/>} iconBackgroundColor='#EDE3FF' title='Ümumi məbləğ' moneyAmount={412} />
          <Custom Icon={<MoneyFillCyan/>} iconBackgroundColor='#E2FBFF' title='Xərclənən məbləğ' moneyAmount={222} />
        </div>

        {/* Increase button */}
        <div className='self-center'>
          <IncreanceBalance Icon={<Plus />} text='Balans artırmaq' backgroundColor='#F5AB20' />
        </div>
      </div>


      {/* List of Assets */}
      <div className='flex flex-col gap-6'>
        {/* Title */}
        <h2 className="font-medium text-xl">Aktivliklər siyahısı</h2>

        <FilterSection/>
        {/* Search bar */}
        {/* <div className='flex'> */}
          {/* <SearchBoxWithDropdown filters={[{ key: 1, label: 'Ən yeni' }]} placeholder='Axtar' /> */}
        {/* </div> */}
      
        {/* Assets table */}
        <ListOfAssets />

      </div>


      
    </SectionWrapper>
  )
}

export default page