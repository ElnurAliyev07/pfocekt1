import React from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Testimonials from './components/Testimonials'
import SectionWrapper from '@/components/common/wrappers/SectionWrapper'

const page = () => {
  return (
    <SectionWrapper disabled>
      <Header />
      <Main />
      <Testimonials />
    </SectionWrapper>
  )
}

export default page
