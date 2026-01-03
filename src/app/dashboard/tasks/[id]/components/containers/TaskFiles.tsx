import React, { useState, useEffect } from "react";
import FileInput from "@/components/ui/file/FileInput";
import { CustomFile } from "@/types/customFile.type";
import { customFileToFile } from "@/utils/fileUtils";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import FileInputLoading from "@/components/ui/file/FileInputLoading";

interface Props {
  taskFiles: CustomFile[];
}

interface ConvertedFile extends Omit<CustomFile, 'file'> {
  file: File;
}

const TaskFiles: React.FC<Props> = ({ taskFiles }) => {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const convertFiles = async () => {
      try {
        const converted = await Promise.all(
          taskFiles.map(async (item) => ({
            ...item,
            file: await customFileToFile(item.file)
          }))
        );
        setConvertedFiles(converted);
      } catch (error) {
        console.error("Error converting files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    convertFiles();
  }, [taskFiles]);


  return (
    <div className="mt-[24px]">
      <h4 className="text-[14px] leading-[20px] text-t-gray">Fayllar:</h4>
      <div className="mt-[8px] pr-[8px] flex gap-[12px]">
      <InitializerWrapper
          loadingComponent={
            <div className="animate-pulse flex gap-[12px]">
              {taskFiles?.map((_, index) => (
                <FileInputLoading key={index} />
              ))}
            </div>
          }
          isLoading={isLoading}
        >
          {convertedFiles.map((item, index) => (
          <FileInput
            key={index}
            file={item.file}
            index={index}
            onDownload={() => {
              const url = URL.createObjectURL(item.file);
              const a = document.createElement("a");
              a.href = url;
              a.download = item.title;
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        ))}
        </InitializerWrapper>
        
      </div>
    </div>
  );
};

export default TaskFiles; 