'use client'
import React, { useEffect } from 'react'
import SearchInput from '../inputs/Search'
import VacancyItem from '../common/VacancyItem';
import CreateVacancyModal from '../modals/CreateVacancyModal';
import { useVacancyStore } from '@/store/vacancy.store';
import { Select, SelectItem } from '@/components/ui/form';

const dates = [
    { key: "text", label: "Bu gün" },
    { key: "number", label: "Bu həftə" },
    { key: "date", label: "Bu ay" },
    { key: "single_date", label: "Bu il" },
];

const Vacancies = () => {

    const {fetchVacancies, vacancies} = useVacancyStore();

    // useEffect(() => {
    //     const getVacanciesList = async () => {
    //         await fetchVacancies(false)
    //     }
    //     getVacanciesList();
    // }, [fetchVacancies])


    return (
        <div className='mt-[20px] md:mt-[42px]'>
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                <div className="flex gap-[16px] md:gap-[32px] flex-col">
                    <h3 className="text-[20px] md:text-[28px] font-medium leading-[28px] md:leading-[36px]">Vakansiyalar</h3>
                    <div className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-[12px]'>
                    <SearchInput
                        onSearch={(query: string) => console.log(query)}
                        className='w-full md:w-auto'
                    />
                    <Select
                        placeholder="Tarix"
                        onValueChange={(e) => console.log(e)}
                    >
                        {dates.map((date) => (
                            <SelectItem key={date.key} value={date.key}>
                                {date.label}
                            </SelectItem>
                        ))}
                    </Select>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <CreateVacancyModal />
                </div>
            </div>

            <div className="mt-[36px] max-w-[300px] md:max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <table className="w-full table-auto text-center text-[14px] md:text-[20px]">
                        <thead className='border-b border-gray'>
                            <tr className="font-medium text-t-black text-[14px] md:text-[20px]">
                                <th className="px-1 md:px-4 py-2 md:py-3">Vakansiya</th>
                                <th className="px-1 md:px-4 py-2 md:py-3">Tarix</th>
                                <th className="px-1 md:px-4 py-2 md:py-3">Müraciət sayı</th>
                                <th className="px-1 md:px-4 py-2 md:py-3">Müraciət</th>
                                <th className="px-1 md:px-4 py-2 md:py-3"></th>
                                <th className="px-1 md:px-4 py-2 md:py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vacancies.map((vacancy, index) => (
                                <VacancyItem key={index} vacancy={vacancy} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Vacancies
