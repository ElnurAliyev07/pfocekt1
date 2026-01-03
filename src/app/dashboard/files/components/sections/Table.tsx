"use client";

import React, { useEffect, useState } from "react";
import Search from "../ui/icons/Search";
import Image from "next/image";
import Menu from "@/components/ui/icons/Menu";
import OrderArrows from "../ui/buttons/OrderArrows";
import Pagination from "@/components/ui/pagination/Pagination";
import { useDocumentStore } from "@/store/documentStore";
import { formatDateOnly } from "@/utils/formateDateTime";
import { getURLParam, updateURLParam } from "@/utils/urlUtils";
import { formatByteSize } from "@/utils/sizeUtils";
import MediaPreviewModal from "@/components/common/modals/MediaPreviewModal";

const Table = () => {
  const { documents, fetchDocuments, page, totalPages, setPage } =
    useDocumentStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    title: string;
    type:
      | "image"
      | "video"
      | "pdf"
      | "document"
      | "spreadsheet"
      | "presentation"
      | "other";
  } | null>(null);

  useEffect(() => {
    const currentPage = getURLParam("page") || 1;
    setPage(Number(currentPage));
    const loadDocuments = async () => {
      await fetchDocuments(false);
    };
    loadDocuments();
  }, [fetchDocuments, setPage]);

  // Determine file type based on file name or MIME type
  const getFileType = (
    file: string
  ):
    | "image"
    | "video"
    | "pdf"
    | "document"
    | "spreadsheet"
    | "presentation"
    | "other" => {
    const extension = file.split(".").pop()?.toLowerCase();

    if (!extension) return "other";

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg", "mov"].includes(extension)) {
      return "video";
    } else if (extension === "pdf") {
      return "pdf";
    } else if (["doc", "docx", "txt", "rtf"].includes(extension)) {
      return "document";
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      return "spreadsheet";
    } else if (["ppt", "pptx"].includes(extension)) {
      return "presentation";
    }

    return "other";
  };

  const handlePreview = (file: string, title: string) => {
    setSelectedMedia({
      url: file,
      title: title,
      type: getFileType(file),
    });
    setPreviewOpen(true);
  };

  const shortenFilename = (filename: string) => {
    const maxLength = 20;
    if (filename.length <= maxLength) return filename;

    const ext = filename.substring(filename.lastIndexOf("."));
    const name = filename.substring(0, maxLength - ext.length - 3);
    return `${name}...${ext}`;
  };

  return (
    <div className="max-w-[350px] md:max-w-full">
      <div className="mt-[72px]">
        <div className="bg-white border border-borderDefault rounded-[12px] h-[48px] w-full md:w-[290px] flex px-[16px] items-center gap-[8px]">
          <Search />
          <input
            id="searchInput"
            placeholder="Axtarın"
            className="flex-1 border-none outline-hidden focus:ring-0 p-0"
            type="text"
          />
        </div>
      </div>

      <div className="mt-[36px] mb-[24px] bg-white overflow-x-auto md:overflow-x-hidden">
        <div>
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-4 text-[14px] md:text-[18px] place-items-center text-center font-medium text-t-black py-4">
              <div className="">Əlavə edən şəxs</div>
              <div className="">Sənəd adı</div>
              <div className="flex items-center justify-center gap-[8px]">
                <span>Həcmi</span>
                <OrderArrows />
              </div>
              <div className="">Aid olduğu proyekt</div>
              <div className="flex items-center justify-center gap-[8px]">
                <span>Tarix</span>
                <OrderArrows />
              </div>
              <div className=""></div>
            </div>

            {/* Data Rows */}
            <div id="user-container" className="space-y-[8px] text-center">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 border-t border-b border-borderDefault gap-4 py-[11px] items-center text-t-black dark:text-gray-400"
                >
                  <div className="flex justify-center items-center gap-[4px]">
                    {document.user ? (
                      <>
                        <Image
                          src={document.user?.user_profile?.image || "/grid.png"}
                          alt="Profile Image"
                          className="w-[36px] h-[36px] rounded-full object-cover"
                          width={1000}
                          height={1000}
                        />
                      </>
                    ) : (
                      <p className="text-gray-500 italic">Yoxdur</p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handlePreview(document.file, document.title)
                      }
                      className="text-primary hover:underline cursor-pointer"
                      title={document.title}
                    >
                      {shortenFilename(document.title)}
                    </button>
                  </div>
                  <div>{formatByteSize(document.size)}</div>
                  <div>{document.related_object_display}</div>
                  <div>{formatDateOnly(document.created)}</div>
                  <div className="flex items-center justify-center text-gray-500 text-xl">
                    <Menu />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto md:overflow-x-hidden block md:flex md:justify-end">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(e) => {
            setPage(e);
            updateURLParam("page", String(e));
            fetchDocuments();
          }}
        />
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <MediaPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          alt={selectedMedia.title}
        />
      )}
    </div>
  );
};

export default Table;
