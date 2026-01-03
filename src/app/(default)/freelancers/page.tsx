import React from 'react'
import Freelancers from './components/sections/Freelancers'
import Services from './components/sections/Services'
import Hero from './components/sections/Hero'

const page = () => {
  return (
    <div>
      <Hero />
      <Freelancers />
      <Services />
    </div>
  )
}

export default page
