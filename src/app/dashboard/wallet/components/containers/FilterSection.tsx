'use client'

import React from 'react'
import SearchInput from '../inputs/Search'
import { debounce } from '@/utils/debounceUtils';
import { updateURLParam } from '@/utils/urlUtils';
import useWalletStore from '@/store/walletStore';

const FilterSection = () => {
    const {searchQuery, setSearchQuery, fetchWorkspaces} = useWalletStore();
    const handleSearch = debounce(async (query: string) => {
        updateURLParam("search", query);
        // setIsLoading(true);
        setSearchQuery(query);

        // URL'deki sorgu parametresini güncelle
        await fetchWorkspaces(true);

        // setIsLoading(false);
    }, 300);

    return (
        <div className='flex'>
            <SearchInput
                defaultValue={searchQuery} // searchQuery'yi buraya bağladık
                onSearch={handleSearch}
            />
        </div>

    )
}

export default FilterSection