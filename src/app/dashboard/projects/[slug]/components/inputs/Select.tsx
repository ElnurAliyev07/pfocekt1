import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown/Dropdown";

interface SelectProps {
  items: { key: string; label: string }[]; // Dışarıdan gelen değerler
  placeholder: string; // Varsayılan placeholder
  onChange: (value: string) => void; // Değişiklik bildirimi
}

export default function Select({
  items,
  placeholder,
  onChange,
}: SelectProps): React.ReactElement {
  // Seçili anahtarları tutan state
  const [selectedKey, setSelectedKey] = useState<string>("");

  // Seçili değeri türet
  const selectedValue = useMemo(() => {
    if (selectedKey) {
      const selectedItem = items.find((item) => item.key === selectedKey);
      return selectedItem ? selectedItem.label : placeholder;
    }
    return placeholder;
  }, [selectedKey, items, placeholder]);

  // Seçim değiştiğinde yeni değeri işle
  const handleSelectionChange = (key: string) => {
    setSelectedKey(key);
    onChange(key);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline" className="capitalize rounded-[48px] border bg-white">
          <span>{selectedValue}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path
              d="M16.6004 7.45898L11.1671 12.8923C10.5254 13.534 9.47539 13.534 8.83372 12.8923L3.40039 7.45898"
              stroke="#14171A"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem 
            key={item.key} 
            onClick={() => handleSelectionChange(item.key)}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
