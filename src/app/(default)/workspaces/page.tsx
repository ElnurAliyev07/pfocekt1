import React from 'react'
import VirtualOffices from './components/sections/VirtualOffices'
import Contact from './components/sections/Contact'
import Hero from './components/sections/Hero'
import { getVacancyService } from '@/services/server/vacancy.service'
import { getWorkspaceContactService, getWorkspaceHeroService } from '@/services/server/workspace.service'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const Page = async (
  props: {
    searchParams: SearchParams
  }
) => {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page || 1);
  const vacancyData = await getVacancyService(page, 6);
  const workspaceHero = await getWorkspaceHeroService()
  const workspaceContact = await getWorkspaceContactService()
  
  return (
    <div>
      {
        workspaceHero.data.length > 0 && (
          <Hero data={workspaceHero.data[0]} />
        )
      }
      <VirtualOffices vacancyResponse={vacancyData.data} page={page} />
      
      {
        workspaceContact.data.length > 0 && (
          <Contact data={workspaceContact.data[0]} />
        )
      }
    </div>
  )
}

export default Page
