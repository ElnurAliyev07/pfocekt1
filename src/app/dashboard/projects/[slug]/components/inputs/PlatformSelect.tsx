import React from "react";

export interface PlatformOptionValue {
  platform: string;
  link?: string;
}

export interface PlatformOption {
  value: PlatformOptionValue;
  label: string;
}

interface FlexibleMultiSelectProps {
  value: PlatformOptionValue[];
  onChange: (selected: PlatformOptionValue[]) => void;
  options: PlatformOption[];
  placeholder?: string;
}

const PlatformSelect: React.FC<FlexibleMultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select Options",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputVisible, setInputVisible] = React.useState<string | null>(null);
  const [tempLinks] = React.useState<{ [key: string]: string }>({}); // Temporary link storage
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedLabels =
    value
      .slice(0, 3)
      .map((val) => options.find((opt) => opt.value.platform === val.platform)?.label)
      .filter(Boolean)
      .join(", ") +
    (value.length > 3 ? ", ..." : "") ||
    placeholder;

  const toggleSelection = (platform: string) => {
    const isSelected = value.find((v) => v.platform === platform);
    if (isSelected) {
      // Remove if already selected
      onChange(value.filter((v) => v.platform !== platform));
    } else {
      // Add with optional link
      onChange([...value, { platform, link: tempLinks[platform] || "" }]);
    }
  };

  const updateLink = (platform: string, link: string) => {
    const updatedValues = value.map((v) =>
      v.platform === platform ? { ...v, link } : v
    );
    onChange(updatedValues);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mx-auto z-1000">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 px-4 h-[52px] rounded-[8px] text-[16px] text-left text-gray-700 border focus:outline-hidden flex justify-between items-center"
      >
        <span>{selectedLabels}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
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
          className="absolute top-14 left-0 z-1000 w-full bg-white shadow-lg border rounded-lg py-4 px-3"
        >
          <div className="max-h-[300px] pr-1 space-y-[4px] custom-scrollbar overflow-y-auto">
            {options.map((option) => (
              <div className="space-y-[8px]" key={option.value.platform}>
                <div className={`${inputVisible === option.value.platform && 'bg-[#F1F1FF]'} rounded-[8px] flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer`}>
                  <div
                    onClick={() =>
                      setInputVisible(
                        inputVisible === option.value.platform ? null : option.value.platform
                      )}
                    className="text-gray-700 flex-1">{option.label}</div>
                  <div
                    onClick={() => toggleSelection(option.value.platform)}
                    className={`w-6 h-6 flex items-center justify-center border-2 rounded transition ${value.some((v) => v.platform === option.value.platform)
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-300"
                      }`}
                  >
                    {value.some((v) => v.platform === option.value.platform) && (
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

                {inputVisible === option.value.platform && (
                  <input
                    placeholder="Linki daxil edin"
                    type="text"
                    className="border rounded-[8px] h-[40px] px-[14px] w-full mt-2"
                    value={value.find((v) => v.platform === option.value.platform)?.link || ""}
                    onChange={(e) =>
                      updateLink(option.value.platform, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 mt-2 text-center text-primary font-semibold rounded-sm hover:bg-gray-50"
          >
            Təsdiqlə
          </button>
        </div>
      )}
    </div>
  );
};

export default PlatformSelect;
