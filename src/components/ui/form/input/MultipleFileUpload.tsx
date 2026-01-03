"use client";

import Pin from "@/app/dashboard/subtasks/[id]/components/icons/Pin";
import React, { useState, useCallback, useEffect } from "react";
import FileInput from "../../file/FileInput";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  isDisabled?: boolean;
  defaultValue?: File[]; // ✅ Default value için prop
  isCompleted?: boolean;
  maxFiles?: number;
  accept?: string;
}

const MultipleFileUpload: React.FC<FileUploadProps> = ({
  onChange,
  isDisabled = false,
  isCompleted = false,
  defaultValue = [], // ✅ Varsayılan boş array
  maxFiles,
  accept,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(defaultValue);

  // ✅ defaultValue değiştiğinde state ve parent'ı senkronize et
  useEffect(() => {
    setSelectedFiles(defaultValue);
    onChange(defaultValue);
  }, [defaultValue, onChange]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const filesArray = Array.from(event.target.files);
        const updatedFiles = [...selectedFiles, ...filesArray];
        
        // Check if adding new files would exceed maxFiles limit
        if (maxFiles && updatedFiles.length > maxFiles) {
          const trimmedFiles = updatedFiles.slice(0, maxFiles);
          setSelectedFiles(trimmedFiles);
          onChange(trimmedFiles);
          return;
        }
        
        setSelectedFiles(updatedFiles);
        onChange(updatedFiles);
      }
    },
    [onChange, selectedFiles, maxFiles]
  );

  const handleFileRemove = useCallback(
    (index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      onChange(updatedFiles);
    },
    [onChange, selectedFiles]
  );

  const isMaxReached = maxFiles ? selectedFiles.length >= maxFiles : false;

  return (
    <div className="mt-2 w-full">
      {!isCompleted && (
        <label
          htmlFor={!isDisabled && !isMaxReached ? "file-upload" : ""}
          className={`flex items-center gap-2 font-medium ${
            !isDisabled && !isMaxReached
              ? "cursor-pointer text-primary"
              : "cursor-not-allowed text-primary-disabled"
          }`}
        >
          <Pin
            className={!isDisabled && !isMaxReached ? "fill-primary" : "fill-primary-disabled"}
          />
          <span>Əlavə et</span>
        </label>
      )}

      <input
        type="file"
        id="file-upload"
        multiple={!maxFiles || maxFiles > 1}
        className="hidden"
        onChange={handleFileChange}
        disabled={isDisabled || isMaxReached}
        accept={accept}
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {selectedFiles.map((file, index) => (
            <FileInput
              key={index}
              file={file}
              index={index}
              onDelete={handleFileRemove}
              deleteDisabled={isCompleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleFileUpload;
