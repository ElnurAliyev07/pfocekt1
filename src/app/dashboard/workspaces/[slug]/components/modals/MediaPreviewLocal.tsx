import Image from "next/image";
import { useState } from "react";


interface Media {
  id: number;
  file: string;
  type: "Video" | "Image"
}

export default function MediaPreviewLocalModal({ media }: { media: Media }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative z-1000">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-custom-red rounded-md px-2 h-[24px] text-[12px]"
        >
          Bax
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-1000 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            {media.type === "Video" ? (
              <video className="h-auto w-auto" controls >
                <source src={media.file} type="video/mp4" />
              </video>
            ) : (
              <Image
                className="h-auto w-auto"
                src={media.file}
                width={1000}
                height={1000}
                alt="media"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
