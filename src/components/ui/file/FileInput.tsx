"use client";

import React, { useState, useEffect } from "react";
import { getFileIcon } from "@/utils/mimeTypeUtils";
import { formatByteSize } from "@/utils/sizeUtils";
import { Button } from "@/components/ui";
import Menu from "../icons/Menu";
import MediaPreviewModal from "@/components/common/modals/MediaPreviewModal";
import Image from "next/image";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "../dropdown/Dropdown";

interface FileInputProps {
  file?: File;
  fileSize?: number;
  fileType?: string;
  index: number;
  onDelete?: (index: number) => void;
  onDownload?: () => void;
  deleteDisabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  file,
  fileSize,
  fileType,
  index,
  deleteDisabled = false,
  onDelete,
  onDownload,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    let url: string | null = null;

    if (file) {
      try {
        url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    }

    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  const handleDownload = () => {
    if (onDownload) return onDownload();

    const url = file ? URL.createObjectURL(file) : null;
    const a = document.createElement("a");
    if (url) {
      a.href = url;
      a.download = file?.name || "download";
      a.click();
      if (file) URL.revokeObjectURL(url);
    }
  };

  const handlePreview = () => {
    if (previewUrl) {
      if (displayType === "application/pdf") {
        window.open(previewUrl, "_blank");
      } else {
        setIsPreviewOpen(true);
      }
    }
  };

  const getMediaType = (type: string): "image" | "video" => {
    return type.startsWith("video/") ? "video" : "image";
  };

  const isMediaFile = (type: string): boolean => {
    return type?.startsWith("image/") || type?.startsWith("video/");
  };

  const isPreviewable = (type: string): boolean => {
    return (
      type?.startsWith("image/") ||
      type?.startsWith("video/") ||
      type === "application/pdf"
    );
  };

  const displayName = file?.name || "";
  const displaySize = fileSize || file?.size || 0;
  const displayType = fileType || file?.type || "";

  return (
    <>
      <div className="mt-4 relative group w-[200px] h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="w-full h-full">
          {isMediaFile(displayType) && previewUrl ? (
            displayType.startsWith("image/") ? (
              <Image
                width={1000}
                height={1000}
                src={previewUrl}
                alt={displayName}
                className="w-full !h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={isPreviewable(displayType) ? handlePreview : undefined}
              />
            ) : (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                muted
                onClick={isPreviewable(displayType) ? handlePreview : undefined}
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-600 group-hover:text-neutral-900 transition-colors duration-300">
              {getFileIcon(displayType)}
              <span
                className="mt-3 text-sm font-medium text-center break-all line-clamp-2"
                title={displayName}
              >
                {displayName}
              </span>
              <span className="mt-1 text-xs text-neutral-500 tabular-nums">
                {formatByteSize(displaySize)}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            {isPreviewable(displayType) && (
              <Button
                onClick={handlePreview}
                variant="secondary"
                size="sm"
                className="bg-white/90 !text-neutral-900 hover:!bg-white"
              >
                Önizlə
              </Button>
            )}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 !text-neutral-900 hover:!bg-white px-2"
                >
                  <Menu />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={handleDownload}>
                  Yüklə
                </DropdownItem>
                {!deleteDisabled && onDelete && (
                  <DropdownItem
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {displayType.split("/")[0]}
          </span>
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {formatByteSize(displaySize)}
          </span>
        </div>
      </div>

      {isPreviewable(displayType) &&
        previewUrl &&
        displayType !== "application/pdf" && (
          <MediaPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            mediaUrl={previewUrl}
            mediaType={getMediaType(displayType)}
            alt={displayName}
          />
        )}
    </>
  );
};

export default FileInput;
