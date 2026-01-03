import { Blog, BlogHero } from '@/types/blog.type'
import { formatDate } from '@/utils/formateDateTime'
import Image from 'next/image'
import React from 'react'

interface Props{
  blog: Blog;
  hero: BlogHero
}

const Hero:React.FC<Props> = ({blog, hero}) => {
  return (
    <div>
      <p className="mb-[24px] flex items-center gap-1">
        <span className="text-t-gray text-[12px] md:text-[14px]">Bloqlar</span>
        {/* <AxesRight />
        <span className="text-t-black text-[12px] md:text-[14px]">{blog.blog_title}</span> */}
      </p>

      <section>
        <h2 className="text-t-black leading-[32px] md:leading-[56px] text-[24px] md:text-[40px] font-semibold">{hero.title}</h2>
        <p className="mt-[20px] text-t-gray text-[12px] md:text-[22px] leading-[16px] md:leading-[36px]">{hero.description}</p>
      </section>

      <section className="mt-[36px] md:mt-[48px]">
        <div className="relative w-full h-[355px] md:h-[472px] rounded-[16px] md:rounded-[20px] overflow-hidden">
          <div className="absolute w-full h-full overflow-hidden">
            <Image className="h-full w-full object-cover" width={1000} height={1000} src={blog.blog_image} alt={blog.blog_title} />
          </div>
          <div className="absolute bottom-0 h-[50%] md:h-[28%] lg:h-[38%] w-full bg-black/40 blur-0 px-[20px] py-[16px] lg:p-[24px]">
            <h3 className="text-white text-[16px] md:text-[32px] font-medium leading-[24px] md:leading-[40px]">{blog.blog_title}</h3>
            <div dangerouslySetInnerHTML={{__html: blog.blog_content.slice(0, 100)}} className="mt-[12px] lg:mt-[16px] text-[#F4F5F5] text-[12px] md:text-[20px] leading-[16px] md:leading-[28px]">

            </div>
            <p className="mt-[14px] lg:mt-[28px] text-[#F4F5F5] text-[12px] md:text-[14px] font-medium">{formatDate(blog.created)}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
