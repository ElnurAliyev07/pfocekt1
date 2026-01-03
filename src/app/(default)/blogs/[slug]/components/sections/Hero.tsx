import AxesRight from '@/components/ui/icons/AxesRight'
import { Blog } from '@/types/blog.type'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = ({blog}: {blog: Blog}) => {
  return (
    <div>
          <p className="mb-[48px] flex items-center gap-1">
            <Link href={'/blogs'} className="text-t-gray text-[12px] md:text-[14px]">Bloqlar</Link>
            <AxesRight />
            <span className="text-t-black text-[12px] md:text-[14px]">{blog.blog_title}</span>
          </p>
    
          <section className="lg:mb-[48px]">
            <h2 className="text-t-black leading-[32px] md:leading-[56px] text-[24px] md:text-[40px] font-semibold">{blog.blog_title}</h2>
          </section>
    
          <section className="mt-[36px] md:mt-0">
            <div className="relative w-full h-[355px] md:h-[472px] rounded-[16px] md:rounded-[20px] overflow-hidden">
              <div className="absolute w-full h-full overflow-hidden">
                <Image className="h-full w-full object-cover" width={1000} height={1000} src={blog.blog_image} alt="blog title" />
              </div>
            </div>
          </section>
        </div>
  )
}

export default Hero
