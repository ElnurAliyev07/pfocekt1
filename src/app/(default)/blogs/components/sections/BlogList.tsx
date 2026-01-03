'use client'

import { Blog } from '@/types/blog.type'
import { PaginatedResponse } from '@/types/response.type'
import React from 'react'
import BlogItem from '../common/BlogItem'
import Pagination from '@/components/ui/pagination/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
    blogs: PaginatedResponse<Blog>,
    page: number,
    pageSize: number
}

const BlogList: React.FC<Props> = ({ blogs, page, pageSize }) => {
    const dynamicTotalPages = Math.ceil(blogs.count / pageSize); // Sayfa sayısını hesapla
    const router = useRouter(); // Router için kullanılır
    const searchParams = useSearchParams(); // Mevcut URL parametrelerini almak için kullanılır

    return (
        <>
            <div className="mt-[36px] lg:mt-[40px] flex flex-col md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
                {
                    blogs.results.map((item, index) => (
                        <BlogItem blog={item} key={index} />
                    ))
                }
            </div>
            {page > 1 &&
                <div className="mt-[48px] flex justify-center">
                    <Pagination currentPage={page} totalPages={dynamicTotalPages} onPageChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', e.toString());
                        router.push(`?${params.toString()}`,  { scroll: false });
                        }} 
                    />
                </div>
            }
        </>
    )
}

export default BlogList