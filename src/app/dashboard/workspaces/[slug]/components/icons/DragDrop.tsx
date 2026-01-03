import React from "react";

interface DragDropProps {
  color?: string;
  size?: number;
}

const DragDrop: React.FC<DragDropProps> = ({ color = "#4F46E5", size = 18 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 11.3252V9.3252C19 8.79476 18.7893 8.28605 18.4142 7.91098C18.0391 7.53591 17.5304 7.3252 17 7.3252H9C8.46957 7.3252 7.96086 7.53591 7.58579 7.91098C7.21071 8.28605 7 8.79476 7 9.3252V17.3252C7 17.8556 7.21071 18.3643 7.58579 18.7394C7.96086 19.1145 8.46957 19.3252 9 19.3252H11M3 3.3252V3.3352M7 3.3252V3.3352M11 3.3252V3.3352M15 3.3252V3.3352M3 7.3252V7.3352M3 11.3252V11.3352M3 15.3252V15.3352M13 13.3252L22 16.3252L18 18.3252L16 22.3252L13 13.3252Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DragDrop;
