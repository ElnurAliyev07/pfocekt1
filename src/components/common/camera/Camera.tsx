'use client'
import { DropdownExample } from '@/components/ui/dropdown/Dropdown';
import React, { useState } from 'react'
const options = [
  { value: 'option1', label: 'Seçenek 1', icon: '🎯' },
  { value: 'option2', label: 'Seçenek 2' },
  { value: 'option3', label: 'Seçenek 3', disabled: true },
];

const Camera = () => {
  return (
    <div>
    <DropdownExample/>
    </div>
  )
}

export default Camera