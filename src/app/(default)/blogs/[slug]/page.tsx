import React from 'react'
import Hero from './components/sections/Hero'
import { notFound } from 'next/navigation';
import { getBlogDetailService } from '@/services/server/blog.service';
import { formatDateOnly } from '@/utils/formateDateTime';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    try {
        const response = await getBlogDetailService(slug);
        return (
            <section className='custom-container pt-[84px] lg:pt-[148px]'>
                <Hero blog={response.data} />

                <div className="mt-[72px] lg:mt-[32px]">
                    <p className='text-[20px] font-medium leading-[30px] text-t-gray text-end mb-[48px]'>{formatDateOnly(response.data.created)}</p>

                    <div dangerouslySetInnerHTML={{ __html: response.data.blog_content }}  className=''> 
                    </div>

                </div>


            </section>


        )
    } catch {
        notFound()
    }
}




export default page
