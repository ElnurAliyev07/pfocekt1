import React from 'react'
import ApplicationItem from '../common/ApplicationItem'
import SectionWrapper from '@/components/common/wrappers/SectionWrapper'

const Applications = () => {
    return (
            <SectionWrapper disabled className="mt-[36px] max-w-[300px] md:max-w-[700px] lg:max-w-full overflow-x-auto">
                <div className='min-w-[800px]'>
                <table className="w-full table-auto text-center text-[14px] lg:text-[20px]">
                    <thead className='border-b border-gray'>
                        <tr className="font-medium text-t-black text-[14px] md:text-[15px] lg:text-[20px]">
                            <th className="px-1 lg:px-4 py-2 lg:py-3">Ad, Soyad</th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3">Vakansiya</th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3">Müraciət Tarixi</th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3">Status</th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3"></th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3"></th>
                            <th className="px-1 lg:px-4 py-2 lg:py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <ApplicationItem />
                        <ApplicationItem />
                        <ApplicationItem />
                    </tbody>
                </table>
                </div>

            </SectionWrapper>
    )
}

export default Applications
