'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import CustomerComment from '../common/comment/CustomerComment';
import "./Testimonials.style.css"
import { Testimonial } from '@/types/home.type';

interface Props {
    testimonials: Testimonial[]
}

const Testimonials:React.FC<Props> = ({testimonials}) => {

    return (

        <section className="mt-[80px] md:mt-[100px] lg:mt-[148px] custom-container">
            <h1 className='text-[24px] md:text-[40px] leading-[32px] md:leading-[56px] font-semibold'>Müştərilərimizdən Gələn Rəylər </h1>

            <div className="overflow-visible tesitonialSwipper">
                <Swiper

                    modules={[Pagination]}
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                      }}
                    spaceBetween={10}
                    slidesPerView={1.2}
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
                            slidesPerView: 2.2,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 122,
                        },
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index} className="swiper-slide">
                          <CustomerComment data={testimonial} />
                        </SwiperSlide>
                    ))}

                </Swiper>
                
            </div>

        </section>

    )
}

export default Testimonials
