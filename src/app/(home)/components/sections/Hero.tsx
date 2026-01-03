import React, { memo } from 'react'
import BeFreelancer from '../ui/buttons/BeFreelancer'
import Image from 'next/image'
import { HeroSection } from '@/types/home.type'
import HeroIconLeft from '../ui/icons/HeroIconLeft'
import HeroIconRight from '../ui/icons/HeroIconRight'

interface Props {
    data: HeroSection
}

const Hero: React.FC<Props> = memo(({ data }) => {
    return (
        <section className="pt-[60px] lg:pt-[280px] relative h-[700px] md:h-[600px] lg:h-[800px]">
            <div className='top-0 absolute mx-auto left-1 right-1 z-20 custom-container grid md:grid-cols-2 lg:gap-[128px] h-full' >
                <div className="flex md:pb-[121px] w-full items-end md:mt-0">
                    <div className="w-full">
                        <h2 className="text-[24px] lg:text-[48px]  font-semibold leading:[32px] lg:leading-[56px] text-t-black dark:text-text-dark-black">{data.title}</h2>
                        <p className="text-[12px] lg:text-[22px] font-normal mt-[12px] md:mt-[20px] leading-[16px] md:leading-[36px] text-t-gray dark:text-text-dark-black">{data.description}</p>
                        <div className="mt-[48px] lg:mt-[64px] md:flex">
                            <BeFreelancer />
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-center md:justify-end">
                    <Image 
                        className="w-auto max-h-[400px] md:h-auto md:w-auto" 
                        width={800} 
                        height={600} 
                        src={data.image} 
                        alt="Hero"
                        priority
                        quality={85}
                    />
                </div>
            </div>
            <Image 
                className="absolute top-0 left-0 h-full w-full object-cover" 
                width={1200} 
                height={800} 
                src={'/home-hero-overlay.png'} 
                alt="Hero"
                priority
                quality={85}
                // placeholder="blur"
                // blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwSEw7SjsuLzlCRUFOMkI5QkVGTUVHS1NWW1xfOUNkbWVabFNbW1v/2wBDARUXFxsaGxsdHRsdW0o7Sltba2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className='absolute mx-auto top-[340px] lg:top-[242px] left-1 right-1 custom-container'>
                <div className='lg:ml-[616px]'>
                    <HeroIconLeft />
                </div>
            </div>
            <div className='absolute mx-auto top-[320px] lg:top-[169px] left-1 right-1 custom-container'>
                <div className='flex justify-end'>
                    <HeroIconRight />
                </div>      
            </div>
        </section>
    )
})

Hero.displayName = 'Hero'

export default Hero
