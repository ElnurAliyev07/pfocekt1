'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  HiSearch,
  HiX,
  HiCheckCircle,
  HiInformationCircle,
  HiUser,
} from "react-icons/hi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: number;
      title: string;
      type: "task" | "project" | "user" | "workspace";
    }>
  >([]);

  // Handle search
  const handleSearch = ( resultType: "task" | "project" | "user" | "workspace") => {
    if (searchQuery.trim()) {
      switch (resultType) {
        case "workspace":
          window.location.href = `/dashboard/workspaces?search=${searchQuery}`;
          break;
        case "task":
          window.location.href = `/dashboard/tasks?search=${searchQuery}`;
          break;
        case "project":
          window.location.href = `/dashboard/projects?search=${searchQuery}`;
          break;
        case "user":
          window.location.href = `/dashboard/users?search=${searchQuery}`;
          break;
      }
      onClose();
    }
  };

 
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    
    // Mock search results based on query
    if (query.trim().length > 0) {
      // This would be an API call in a real implementation
      const results = [
        {
            id: 4,
            title: `Virtual ofis: ${query}`,
            type: "workspace" as const,
          },
        // {
        //   id: 1,
        //   title: `Tapşırıq: ${query}`,
        //   type: "task" as const,
        // },
        // {
        //   id: 2,
        //   title: `Layihə: ${query}`,
        //   type: "project" as const,
        // },
        // {
        //   id: 3,
        //   title: `İstifadəçi: ${query}`,
        //   type: "user" as const,
        // },
        
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Get icon for search result by type
  const getResultIcon = (type: string) => {
    switch (type) {
      case "workspace":
        return <HiCheckCircle className="w-5 h-5 text-blue-500" />;
      case "task":
        return <HiCheckCircle className="w-5 h-5 text-blue-500" />;
      case "project":
        return <HiInformationCircle className="w-5 h-5 text-green-500" />;
      case "user":
        return <HiUser className="w-5 h-5 text-purple-500" />;
      default:
        return <HiSearch className="w-5 h-5 text-gray-500" />;
    }
  };

  // Focus on the input when modal opens
  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('search-input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-28"
      onClick={onClose}
    >
      <div
        className="w-[600px] max-w-[90vw] bg-white rounded-lg shadow-xl animate-in slide-in-from-top duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchInput(e.target.value);
                }}
                placeholder="Axtar..."
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
              />
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                  aria-label="Clear search"
                >
                  <HiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
              aria-label="Close search"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto">
            <div className="px-4 py-2 text-sm text-gray-500">
              {searchResults.length} nəticə tapıldı
            </div>
            <div className="divide-y divide-gray-100">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    handleSearch(result.type);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getResultIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults && searchResults.length === 0 && (
          <div className="px-4 py-8 text-center">
            <HiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              "{searchQuery}" üçün nəticə tapılmadı
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
