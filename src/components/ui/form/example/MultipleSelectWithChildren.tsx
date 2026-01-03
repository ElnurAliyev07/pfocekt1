'use client';

import React, { useState } from 'react';
import MultipleSelect, { MultipleSelectItem } from '../MultipleSelect';

const MultipleSelectWithChildren = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-medium mb-4">MultipleSelect with SelectItem Children</h2>
      
      <MultipleSelect 
        label="Select your favorite colors"
        placeholder="Choose colors"
        helperText="This example uses child components"
        onChange={setSelectedValues}
      >
        <MultipleSelectItem value="red">Red</MultipleSelectItem>
        <MultipleSelectItem value="blue">Blue</MultipleSelectItem>
        <MultipleSelectItem value="green">Green</MultipleSelectItem>
        <MultipleSelectItem value="yellow">Yellow</MultipleSelectItem>
        <MultipleSelectItem value="purple">Purple</MultipleSelectItem>
        <MultipleSelectItem value="orange">Orange</MultipleSelectItem>
      </MultipleSelect>
      
      <p className="mt-2 text-sm">
        Selected colors: {selectedValues.length > 0 
          ? selectedValues.join(', ') 
          : 'None'}
      </p>
    </div>
  );
};

export default MultipleSelectWithChildren; 