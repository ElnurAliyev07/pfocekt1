'use client'
import React from 'react'
import "./VirtualOffices.style.css"
import AxesTopRight from '@/components/ui/icons/AxesTopRight'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const VirtualOffices = () => {
  return (
<section className="mt-[80px] md:mt-[200px] custom-container">
    <div className="flex items-center justify-between">
        <h3 className="text-[24px] md:text-[36px] leading-[44px] text-t-black dark:text-text-dark-black font-semibold">Virtual ofislər</h3>
        <div className="hidden md:block">
            <a href="#" className="relative flex gap-[8px] items-center">
                <span className="text-t-black text-[20px] font-medium">Daha çox</span>
                <AxesTopRight className='fill-black'/>
            </a>
        </div>
    </div>
    <div className="mt-[48px] hidden md:grid grid-cols-3 gap-[24px]">
       
    </div>
    <div className="swiper virtualOfficeSwipper mt-[24px] md:hidden!">
    <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
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
          <SwiperSlide >
            <div>1</div>
          </SwiperSlide>
          <SwiperSlide >
          <div>1</div>
          </SwiperSlide>
          <SwiperSlide >
          <div>1</div>
          </SwiperSlide>
      </Swiper>
      <div className="swiper-pagination flex items-center justify-center"></div>
    </div>
</section>
  )
}

export default VirtualOffices
