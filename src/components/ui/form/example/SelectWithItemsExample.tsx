'use client';

import React, { useState } from 'react';
import Select, { SelectItem } from '../Select';
import MultipleSelect, { MultipleSelectItem } from '../MultipleSelect';

const SelectWithItemsExample = () => {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  return (
    <div className="max-w-md mx-auto space-y-8 p-6">
      <h1 className="text-xl font-bold mb-6">SelectItem Children Examples</h1>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Select with SelectItem Children</h2>
        <Select 
          label="Select a country"
          placeholder="Choose a country"
          helperText="This is using child components instead of options prop"
          value={singleValue}
          onValueChange={setSingleValue}
        >
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </Select>
        <p className="mt-2 text-sm">Selected country: {singleValue || 'None'}</p>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">MultipleSelect with SelectItem Children</h2>
        <MultipleSelect 
          label="Select programming languages"
          placeholder="Choose languages"
          helperText="You can select multiple options using child components"
          onChange={setMultipleValues}
        >
          <MultipleSelectItem value="js">JavaScript</MultipleSelectItem>
          <MultipleSelectItem value="ts">TypeScript</MultipleSelectItem>
          <MultipleSelectItem value="py">Python</MultipleSelectItem>
          <MultipleSelectItem value="java">Java</MultipleSelectItem>
          <MultipleSelectItem value="csharp">C#</MultipleSelectItem>
          <MultipleSelectItem value="go">Go</MultipleSelectItem>
          <MultipleSelectItem value="rust">Rust</MultipleSelectItem>
        </MultipleSelect>
        <p className="mt-2 text-sm">
          Selected languages: {multipleValues.length > 0 
            ? multipleValues.join(', ') 
            : 'None'}
        </p>
      </div>
    </div>
  );
};

export default SelectWithItemsExample; 