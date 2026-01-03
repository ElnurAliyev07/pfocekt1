import React from 'react'
import Result from './components/sections/Result'
import Advantages from './components/sections/Advantages'
import Hero from './components/sections/Hero'
import { getAboutSectionService } from '@/services/server/about.service'



const page = async () => {

  const response = await getAboutSectionService();

  return (
    <div>
      {
        response[0] && (
          <>
            <Hero data={response[0]} />
            <Result data={response[0]} />
            <Advantages data={response[0]} />
            </>
        )
      }

    </div>
  )
}

export default page
