'use client'

import React, { useState } from 'react'
import Projects from './Projects';
import Users from './Users';
import Planning from './Planning';
import Vacancies from './Vacancies';
import Applications from './Applications';
import { updateURLParam } from '@/utils/urlUtils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Reserves from './Reserves';

type TabType = 'projects' | 'users' | 'planning' | 'vacancy' | 'applications' | 'reserves';

const TabsContainer: React.FC = () => {
    const searchParams = useSearchParams();    
    const [activeTab,] = useState<TabType>(searchParams.get("tab") as TabType || "projects");

    const tabs: Array<{ key: TabType, label: string, component: React.FC }> = [
        { key: 'projects', label: 'Proyektlər', component: Projects },
        { key: 'users', label: 'Üzvlər', component: Users },
        { key: 'planning', label: 'Planlama', component: Planning },
        { key: 'reserves', label: 'Rezervlər', component: Reserves },
        { key: 'vacancy', label: 'Vakansiyalar', component: Vacancies },
        { key: 'applications', label: 'Müraciətlər', component: Applications },
    ];

    return (
        <div className="mt-[36px] bg-white py-[32px] px-[17px] md:pt-[46px] md:px-[28px] md:pb-[34px] rounded-[20px]">
            <div className="flex w-full flex-col">
                <div className=" max-w-[320px] md:max-w-full w-full overflow-x-auto scrollbar-hide">
                    <div className="flex flex-nowrap gap-x-8 pb-px">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                type='button'
                                
                                onClick={() =>{
                                    const params = new URLSearchParams(window.location.search);
                                    params.set("tab", key);
                                    window.location.replace(`?${params.toString()}`);
                                }}
                                className={`pb-2 text-sm border-b-2 font-medium shrink-0 ${
                                    activeTab === key
                                        ? ' border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    {tabs.map(({ key, component: Component }) => 
                        activeTab === key && <Component key={key} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TabsContainer
