'use client'

import React, { useState } from 'react'
import Tasks from './Tasks';
import Users from './Users';
import { useSearchParams } from 'next/navigation';
import { updateURLParam } from '@/utils/urlUtils';
type TabType = 'tasks' | 'users';

const TabsContainer: React.FC = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<TabType>(tab as TabType || 'tasks');

    const tabs: Array<{ key: TabType, label: string, component: React.FC }> = [
        { key: 'tasks', label: 'Tasklar', component: Tasks },
        { key: 'users', label: 'Üzvlər', component: Users },
    ];

    return (
        <div className="mt-[36px] bg-white py-[32px] px-[17px] md:pt-[46px] md:px-[28px] md:pb-[34px] rounded-[20px]">
            <div className="flex w-full flex-col">
                <div className="max-w-[320px] md:max-w-full w-full overflow-x-auto scrollbar-hide">
                    <div className="flex flex-nowrap gap-x-8 pb-px">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveTab(key);
                                    updateURLParam('tab', key);
                                } }
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
                <div className="">
                    {tabs.map(({ key, component: Component }) => 
                        activeTab === key && <Component key={key} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TabsContainer