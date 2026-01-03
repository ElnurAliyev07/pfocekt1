'use client'
import React from 'react'
import "./Categories.style.css"
import CategoryItem from '../common/category/CategoryItem'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Category } from '@/types/home.type'
// import AxesTopRight from '@/components/ui/icons/AxesTopRight';

interface Props {
  categories: Category[]
}

const Categories: React.FC<Props> = ({categories}) => {
  
  return (
<section className="mt-[80px] md:mt-[100px] lg:mt-[200px] custom-container">
    <div className="hidden md:block">
        <div className="flex items-center justify-between">
            <h3 className="text-[24px] md:text-[36px] leading-[44px] text-t-black dark:text-text-dark-black font-semibold">Kateqoriya</h3>
            {/* <a className="flex items-center gap-[8px] font-medium md:text-[20px] stroke-text-black text-t-black dark:text-text-dark-black " href="">
                <span>Bütün kateqoriyalar</span>
                <AxesTopRight className="fill-black" />
            </a> */}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[64px]">
                {categories.map((item,index) => (
                   <CategoryItem key={index} item={item}/>
                ))}
        </div>
    </div>
    <div className="md:hidden">
        <div>
            <h3 className="text-[24px] leading-[32px] text-t-black dark:text-text-dark-black font-semibold">Kateqoriya</h3>
            {/* <div className="flex justify-end mt-[36px]">
                <a className="flex items-center gap-[8px] font-medium md:text-[20px] stroke-text-black text-t-black dark:text-text-dark-black " href="">
                    <span>Bütün kateqoriyalar</span>
                    <AxesTopRight />
                </a>
            </div> */}
        </div>
        <div className="categorySwipper mt-[24px]">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, dynamicBullets: true}}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          492: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
      >
          {categories.map((item,index) => (
            <SwiperSlide key={index} className="swiper-slide">
            <CategoryItem item={item}/>
          </SwiperSlide>
          ))}
      </Swiper>
    </div>
    </div>
</section>
  )
}

export default Categories
