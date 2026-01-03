'use client';

import React, { useState } from 'react';
import Select, { SelectItem } from '../Select';

const SelectWithChildren = () => {
  const [value, setValue] = useState<string>('');

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-medium mb-4">Select with SelectItem Children</h2>
      
      <Select 
        label="Select a fruit"
        placeholder="Choose a fruit"
        helperText="This example uses child components"
        value={value}
        onValueChange={setValue}
      >
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="strawberry">Strawberry</SelectItem>
      </Select>
      
      <p className="mt-2 text-sm">Selected fruit: {value || 'None'}</p>
    </div>
  );
};

export default SelectWithChildren; 