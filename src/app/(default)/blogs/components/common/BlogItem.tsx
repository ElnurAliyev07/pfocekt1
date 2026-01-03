import { Blog } from '@/types/blog.type'
import {  formatDateOnly } from '@/utils/formateDateTime';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

interface Props{
  blog: Blog;
}

const BlogItem:React.FC<Props> = ({blog}) => {
  return (
    <div className="h-[562px] flex flex-col bg-white rounded-[20px] px-[22px] md:px-[16px] py-[24px] md:py-[32px]">
      <div>
        <Image className="h-[310px] w-full object-cover rounded-[12px]" width={1000} height={1000} src={blog.blog_image} alt={blog.blog_title} />
      </div>
      <div className="mt-[16px] md:mt-[20px]">
        <h3 className="text-t-black text-[16px] md:text-[20px] font-medium leading-[24px] md:leading-[28px]">{blog.blog_title}</h3>
        <div dangerouslySetInnerHTML={{__html: blog.blog_content.slice(0, 100)}} className="mt-[12px] w-[262px] md:w-full text-t-gray text-[14px] leading-[20px]">
          
        </div>
      </div>
      <div className="grow flex items-end justify-between">
        <span className="text-t-gray font-medium text-[14px] md:text-[16px]">{formatDateOnly(blog.created)}</span>
        <Link href={`/blogs/${blog.slug}`} className="text-[16px] md:text-[20px] font-medium text-t-black">Daha çox</Link>
      </div>
    </div>
  )
}

export default BlogItem
