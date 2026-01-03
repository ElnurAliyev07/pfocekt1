import React from 'react'
import FreelancerItem from '../common/FreelancerItem'

const Freelancers = () => {
  return (
    <section className="mt-[72px] md:mt-[100px] lg:mt-[160px] custom-container">
        <h3 className="text-[24px] md:text-[36px] leading-[32px] md:leading-[44px] text-t-black dark:text-text-dark-black font-semibold">Frilanserlərimiz</h3>
    <div className="mt-[48px] md:mt-[46px] flex flex-col md:grid grid-cols-2 gap-[24px]">
        <FreelancerItem />
        <FreelancerItem />
        <FreelancerItem />
        <FreelancerItem />
    </div>
    <div className='mt-[24px] text-end block md:hidden'>
      <a href="#" className='text-[16px] leading-[24px] font-medium'>Daha çox</a>
    </div>
</section>
  )
}

export default Freelancers
