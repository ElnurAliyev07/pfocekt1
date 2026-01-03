import React from 'react'
import TabMenu from './components/common/TabMenu'
import ProfileCard from './components/common/ProfileCard'
import About from './components/section/About'
import PersonalInformation from './components/section/PersonalInformation'
import Milestone from './components/common/Milestone'
import Comments from './components/section/Comments'
import Salary from './components/common/Salary'
import Skills from './components/common/Skills'

const page = () => {
  return (
    <div>
      <TabMenu />
      <div className='mt-[40px]'>
        <ProfileCard />
        <div className='mt-[40px] grid grid-cols-3 gap-[66px]'>
          <div className='col-span-2 flex flex-col gap-[28px]'>
            <About />
            <PersonalInformation /> 
            <Milestone title='Təhsil'/>
            <Milestone title='İş Təcrübəsi'/>
            <Milestone title='Sertifikatlar'/>
            <Comments />
          </div>
          
          <div className='flex flex-col gap-[28px]'>
            <Salary />
            <Skills />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
