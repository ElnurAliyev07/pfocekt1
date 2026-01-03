import React from 'react'
import Hero from './components/sections/Hero'
import { getBlogHeroService, getBlogService, getMainBlogService } from '@/services/server/blog.service'
import BlogList from './components/sections/BlogList'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const Page = async (
  props: {
    searchParams: SearchParams
  }
) => {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page || 1);
  const pageSize = 6;

  const mainBlog = await getMainBlogService()


  const blogList = await getBlogService(page,pageSize);
  const heroData = await getBlogHeroService()

  return (
    <section className='custom-container pt-[84px] lg:pt-[148px]'>
      <Hero hero={heroData.data[0]} blog={mainBlog.data} />

      <section className="mt-[72px]">
        <h2 className="text-t-black text-[24px] md:text-[36px] font-semibold md:font-medium">Bloqlar</h2>

        <BlogList pageSize={pageSize} page={page} blogs={blogList.data}/>

        {/* <div className="mt-[72px] flex justify-center">
        <Pagination currentPage={1} totalPages={10} onPageChange={(e) => {console.log(e)} } />
    </div> */}

      </section>

      {/* <section className="mt-[72px] lg:mt-[148px]">
        <h2 className="text-t-black text-[24px] md:text-[36px] font-semibold">Populyar Bloqlar</h2>

        <div className="mt-[36px] lg:mt-[64px] flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
          
        </div>
      </section>

      <Subscribtion /> */}

    </section>
  )
}

export default Page
