'use client';

import React, { useState } from 'react';
import Select from '../Select';
import MultipleSelect from '../MultipleSelect';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

const SelectExample = () => {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  return (
    <div className="max-w-md mx-auto space-y-8 p-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Single Select Example</h2>
        <Select 
          label="Select an option"
          placeholder="Choose one option"
          helperText="This is a single select example"
          options={options}
          value={singleValue}
          onValueChange={setSingleValue}
        />
        <p className="mt-2 text-sm">Selected value: {singleValue || 'None'}</p>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Multiple Select Example</h2>
        <MultipleSelect 
          label="Select multiple options"
          placeholder="Choose multiple options"
          helperText="You can select multiple options"
          options={options}
          onChange={setMultipleValues}
        />
        <p className="mt-2 text-sm">
          Selected values: {multipleValues.length > 0 
            ? multipleValues.join(', ') 
            : 'None'}
        </p>
      </div>
    </div>
  );
};

export default SelectExample; 