'use client'

import Search from '@/components/ui/icons/Search';
import React from 'react';

type SearchBoxProps = {
  placeholder?: string; // Placeholder text for the search bar
  defaultValue?: string; // Default value for the search input
  onSearch: (query: string) => void; // Function to handle search input
  className?: string; // Class name for the search input
};

const SearchInput: React.FC<SearchBoxProps> = ({ placeholder = 'Axtar...', defaultValue = '', onSearch, className }) => {
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
      <div className={`flex gap-[8px] items-center border rounded-[16px] px-4 py-2 shadow-xs bg-white ${className}`}>
      <button className="text-gray-500 hover:text-gray-700 transition-colors">
        <Search />
      </button>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="grow bg-transparent outline-hidden text-gray-700 placeholder-gray-400"
      />
    </div>
  );
  };


export default SearchInput;
