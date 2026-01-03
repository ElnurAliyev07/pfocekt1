'use client';

import React, { useState } from 'react';
import Select, { SelectItem } from '../Select';
import MultipleSelect, { MultipleSelectItem } from '../MultipleSelect';

const productCategories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Fashion' },
  { value: 'home', label: 'Home & Kitchen' },
  { value: 'books', label: 'Books & Media' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'food', label: 'Food & Beverages' },
];

const tags = [
  { value: 'new', label: 'New Arrival' },
  { value: 'sale', label: 'On Sale' },
  { value: 'popular', label: 'Popular Item' },
  { value: 'trending', label: 'Trending' },
  { value: 'limited', label: 'Limited Edition' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'exclusive', label: 'Exclusive' },
  { value: 'featured', label: 'Featured' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'recommended', label: 'Recommended' },
  { value: 'organic', label: 'Organic' },
  { value: 'handmade', label: 'Handmade' },
];

const FullWidthSelectExample = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Full-Width Select Dropdowns</h1>
        <p className="text-gray-500">
          Modern select components with full-width dropdowns on desktop
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Single Select (Full-Width)</h2>
          <Select
            label="Product Category"
            placeholder="Select a category"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            {productCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </Select>
          
          <div className="mt-3 text-sm">
            Selected: <span className="font-medium">{selectedCategory ? productCategories.find(c => c.value === selectedCategory)?.label : 'None'}</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Multiple Select (Full-Width)</h2>
          <MultipleSelect
            label="Product Tags"
            placeholder="Select tags"
            onChange={setSelectedTags}
          >
            {tags.map(tag => (
              <MultipleSelectItem key={tag.value} value={tag.value}>
                {tag.label}
              </MultipleSelectItem>
            ))}
          </MultipleSelect>
          
          <div className="mt-3">
            <span className="text-sm">Selected:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selectedTags.length === 0 ? (
                <span className="text-sm text-gray-500">None</span>
              ) : (
                selectedTags.map(tag => {
                  const label = tags.find(t => t.value === tag)?.label;
                  return (
                    <span key={tag} className="inline-flex px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium mb-4">Combined Form Example</h3>
        <div className="max-w-lg mx-auto rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter product name"
              />
            </div>
            
            <Select
              label="Product Category"
              placeholder="Select a category"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              options={productCategories}
            />
            
            <MultipleSelect
              label="Product Tags"
              placeholder="Select tags"
              onChange={setSelectedTags}
              options={tags}
            />
            
            <button 
              type="button" 
              className="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Save Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FullWidthSelectExample; 