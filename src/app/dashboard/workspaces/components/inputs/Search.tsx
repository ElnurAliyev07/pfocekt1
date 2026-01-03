'use client'

import Search from '@/components/ui/icons/Search';
import React from 'react';

type SearchBoxProps = {
  placeholder?: string; // Placeholder text for the search bar
  defaultValue?: string; // Default value for the search input
  onSearch: (query: string) => void; // Function to handle search input
};

const SearchInput: React.FC<SearchBoxProps> = ({ placeholder = 'Search...', defaultValue = '', onSearch }) => {
  const [query, setQuery] = React.useState<string>(defaultValue);

  React.useEffect(() => {
    setQuery(defaultValue); // Değer dışarıdan değiştiğinde iç durumu güncelle
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onSearch(newValue);
  };

  return (
    <div className="flex gap-[8px] items-center border rounded-[8px] px-4 py-2  bg-white h-[44px] hover:border-black">
      <button className="text-gray-500 hover:text-gray-700 transition-colors">
        <Search />
      </button>
      <input
        type="text"
        value={query}
        onInput={handleChange}
        placeholder={placeholder}
        className="grow bg-transparent outline-hidden text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};


export default SearchInput;
