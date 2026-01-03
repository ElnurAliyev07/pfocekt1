'use client'
import React, { useEffect, useMemo } from 'react'
import "../../../../(home)/components/sections/VirtualOffices.style.css"
import { Vacancy } from '@/types/vacancy.type';
import { useVacancyStore } from '@/store/vacancy.store';
import Pagination from '@/components/ui/pagination/Pagination';
import { PaginatedResponse } from '@/types/response.type';
import { updateURLParam } from '@/utils/urlUtils';
import SkeletonVacancyItem from '../common/SkeletonVacancyItem';
import VacancyItem from '../common/VacancyItem';

interface Props {
    vacancyResponse: PaginatedResponse<Vacancy>,
    page: number
}

const VirtualOffices: React.FC<Props> = ({ vacancyResponse, page: pageProps }) => {
    const { vacancies, setVacancies, isLoading, totalPages, page, setIsLoading, setPage, fetchVacancies } = useVacancyStore()

    useEffect(() => {
        setVacancies(vacancyResponse)
        setPage(pageProps)
        setIsLoading(false)
    }, [pageProps, setIsLoading, setPage, setVacancies, vacancyResponse])

    const skeletonItems = useMemo(
        () =>
            Array.from({ length: 6 }).map((_, index) => <SkeletonVacancyItem key={index} />),
        []
    );

    return (
        <section className='custom-container'>
            <div className="mt-[72px] md:mt-[124px]">
                <div className="flex items-center justify-between">
                    <h3 className="text-[24px] md:text-[36px] leading-[44px] text-t-black dark:text-text-dark-black font-semibold">Vakansiyalar</h3>
                </div>
                <div className="mt-[36px] md:mt-[48px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] md:gap-[24px]">

                    {
                        !isLoading ? vacancies.map((item, index) => (
                            <VacancyItem item={item} key={index} />
                        ))
                    : 
                        skeletonItems
                    }

                </div>

                {totalPages > 1 && (
                    <div className='flex justify-end mt-[48px]'>
                        <Pagination totalPages={totalPages} currentPage={page} onPageChange={async (e) => {
                            setIsLoading(true);
                            setPage(e);
                            updateURLParam("page", String(e));
                            await fetchVacancies();
                            setIsLoading(false);
                        }}
                        />
                    </div>
                )
                }



            </div>
        </section>
    )
}

export default VirtualOffices
