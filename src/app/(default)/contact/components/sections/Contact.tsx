import React from 'react'
import Form from '../common/Form'
import Map from '../common/Map'
import { ContactInfo } from '@/types/contact.type'


interface Props {
    data: ContactInfo
}

const Contact: React.FC<Props> = ({data}) => {
  return (
    <div className="mt-[24px] md:mt-[36px] order-2 flex flex-col lg:flex-row gap-[36px] md:gap-[54px] md:rounded-[20px] md:bg-white md:py-[64px] md:px-[36px]">
        <Form />
        <Map data={data} />
    </div>
  )
}

export default Contact
