import React from 'react'
import Hero from './components/sections/Hero'
import Contact from './components/sections/Contact'
import { getContactInfoService } from '@/services/server/contact.service'


const page = async () => {
  const contactInfoData = await getContactInfoService();

  return (
    <section className="custom-container flex flex-col">
      {
        contactInfoData.length > 0 && (
          <>
            <Hero data={contactInfoData[0]} />
            <Contact data={contactInfoData[0]} />
          </>
        )
      }
    </section>
  )
}

export default page
