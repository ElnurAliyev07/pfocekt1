import { ContactInfo } from '@/types/contact.type'
import React from 'react'

interface Props {
    data: ContactInfo
}

const Map: React.FC<Props> = ({data}) => {
  return (
    <div className="w-full lg:w-[40%]">
      <iframe className="h-[288px] w-full md:h-[350px] rounded-[10px] md:rounded-[16px]" src={data.location_iframe_link} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
  )
}

export default Map
