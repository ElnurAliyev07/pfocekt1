import { Partner } from '@/types/home.type'
import Image from 'next/image'
import React from 'react'
import Marquee from 'react-fast-marquee'

interface Props {
  partners: Partner[]
}

const Partners: React.FC<Props> = ({ partners }) => {
  // Create a duplicated array of partners
  
  const duplicatedPartners = [...partners, ...partners, ...partners]

  return (
    <section>
      <div className="bg-primary flex items-center h-[48px] md:h-[64px]">
        <Marquee
          gradient={false}
          speed={120}
          pauseOnHover={true}
        >
          {duplicatedPartners.map((item, index) => (
            <div key={`logo-${index}`} className="mx-[12px] md:mx-[80px]">
              <Image 
                className="max-h-[24px] h-[24px] md:max-h-[32px] md:h-[32px] w-auto" 
                width={1000} 
                height={1000} 
                src={item.logo} 
                alt={item.name} 
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default Partners
