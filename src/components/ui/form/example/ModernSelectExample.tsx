'use client';

import React, { useState } from 'react';
import Select, { SelectItem } from '../Select';
import MultipleSelect, { MultipleSelectItem } from '../MultipleSelect';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India' },
  { value: 'sg', label: 'Singapore' },
];

const programmingLanguages = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
];

const ModernSelectExample = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Modern Select Components</h1>
        <p className="text-gray-500 text-sm mb-4">
          Responsive design: Bottom sheet on mobile, dropdown on desktop
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Single Select</h2>
        <Select
          label="Select a country"
          placeholder="Choose a country"
          helperText="This select adapts based on device size"
          value={selectedCountry}
          onValueChange={setSelectedCountry}
          options={countries}
        />
        
        <div className="mt-2 text-sm py-2 px-3 bg-gray-50 rounded-md">
          Selected: <span className="font-medium">{selectedCountry ? countries.find(c => c.value === selectedCountry)?.label : 'None'}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Multiple Select</h2>
        <MultipleSelect
          label="Select programming languages"
          placeholder="Choose languages"
          helperText="You can select multiple options"
          onChange={setSelectedLanguages}
        >
          {programmingLanguages.map(lang => (
            <MultipleSelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </MultipleSelectItem>
          ))}
        </MultipleSelect>
        
        <div className="mt-2 text-sm py-2 px-3 bg-gray-50 rounded-md">
          Selected: 
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedLanguages.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              selectedLanguages.map(lang => {
                const label = programmingLanguages.find(l => l.value === lang)?.label;
                return (
                  <span key={lang} className="inline-flex px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {label}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 text-center pt-4">
        <p>Resize your browser window to see the different layouts.</p>
        <p>Mobile view (bottom sheet) appears when width &lt; 768px.</p>
      </div>
    </div>
  );
};

export default ModernSelectExample; 