import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FlexibleMultiSelectProps {
  value: string[];
  onChange: (selected: string[]) => void;
  options: Option[];
  placeholder?: string;
  searchLabel: string;
  searchPlaceholder?: string
}

const FlexibleMultiSelect: React.FC<FlexibleMultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select Options",
  searchLabel,
  searchPlaceholder
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newOption, setNewOption] = React.useState(""); // Input dəyəri
  const [localOptions, setLocalOptions] = React.useState<Option[]>(options); // Variantlar
  const [filteredOptions, setFilteredOptions] = React.useState<Option[]>(options); // Filterlənmiş variantlar

  const selectedLabels =
    value
      .slice(0, 3) // İlk 5 elemanı al
      .map((val) => localOptions.find((opt) => opt.value === val)?.label)
      .filter(Boolean)
      .join(", ") +
    (value.length > 3 ? ", ..." : "") || 
    placeholder;

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleSelection = (optionValue: string) => {
    const updatedSelection = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(updatedSelection);
  };

  const handleAddOption = () => {
    if (newOption.trim() !== "" && !localOptions.some(opt => opt.value === newOption.trim())) {
      const newOptionObject = { value: newOption.trim(), label: newOption.trim() };
      setLocalOptions((prevOptions) => [...prevOptions, newOptionObject]); // Yeni seçimi əlavə et
      setFilteredOptions((prevOptions) => [...prevOptions, newOptionObject]); // Filterlənmiş siyahıya əlavə et
      onChange([...value, newOptionObject.value]); // Avtomatik seçildi
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNewOption(inputValue);

    // Filterlənmiş variantları müəyyən et
    const filtered = localOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="md:relative mx-auto z-1000">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full py-3 px-4 h-[52px] rounded-[8px] md:rounded-[12px] text-[12px] md:text-[16px] text-left text-gray-700 border focus:outline-hidden focus:ring-2 focus:ring-primary flex justify-between items-center"
      >
        <span>{selectedLabels}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          className="fixed md:absolute top-0 md:top-auto h-screen md:h-auto left-0 z-1000 md:mt-2 w-full bg-white shadow-lg border rounded-lg py-[32px] px-[20px]"
        >
          <div>
            <div className="flex justify-end">
              <button onClick={handleConfirm} type="button">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.99805 5.00195L18.9971 19.001"
                    stroke="#64717C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.99606 19.001L18.9951 5.00195"
                    stroke="#64717C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-[12px] font-medium text-t-black">
              {searchLabel}
            </p>
            <div className="mt-[8px] gap-[16px] flex flex-col md:flex-row  justify-between">
              <div className="flex-1 flex border px-[16px] py-[12px] gap-[12px] h-[48px] rounded-[12px]">
                <input
                  className="border-none w-full text-t-black focus:ring-0 focus:border-none focus:outline-hidden"
                  type="text"
                  placeholder={searchPlaceholder}
                  value={newOption}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-[110px] h-[48px]  rounded-[12px] bg-primary text-white"
                  onClick={handleAddOption}
                >
                  Əlavə et
                </button>
              </div>
            </div>
          </div>
          <div className="mt-[20px] border rounded-[12px] p-[8px]">
            <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={value.includes(option.value)}
                className="flex items-center justify-between rounded-[12px] px-4 py-2 hover:bg-[#F4F4FF] cursor-pointer"
                onClick={() => toggleSelection(option.value)}
              >
                <span className="text-gray-700">{option.label}</span>
                <div
                  className={`w-6 h-6 flex items-center justify-center border-2 rounded-[4px] transition ${
                    value.includes(option.value)
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {value.includes(option.value) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-2 mt-2 text-center text-primary font-semibold rounded-b-lg hover:bg-gray-50"
            >
              Təsdiqlə
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleMultiSelect;

