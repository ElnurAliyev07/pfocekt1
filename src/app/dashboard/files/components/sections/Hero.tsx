'use client'
import React, { useEffect, useState } from "react";
import File from "../ui/icons/File";
import Picture from "../ui/icons/Picture";
import Audio from "../ui/icons/Audio";
import Video from "../ui/icons/Video";
import Link from "next/link";
import { useDocumentStore } from "@/store/documentStore";
import { getLastSegment } from "@/utils/urlUtils";

const Hero = () => {
  const [url, setUrl] = useState<string>("")
  
  const { setType } = useDocumentStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.pathname); // Mevcut URL
    }
    const lastSegment = getLastSegment();
    let type = "";
    if(lastSegment === "documents") type = "document";
    if(lastSegment === "pictures") type = "image";
    if(lastSegment === "audios") type = "audio";
    if(lastSegment === "videos") type = "video";
    setType(type);
    
  }, [setType])



  return (
    <div>
      <h1 className="mt-[36px] text-[32px] font-medium text-t-black leading-[40px]">
        Audiolar
      </h1>

      <div className="mt-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[22px]">
        <Link
          href="/dashboard/files/documents"
          className={`${url === "/dashboard/files/documents" ? "bg-[#F2F3FF]" :  "bg-white"} px-[14px] py-[24px] hover:bg-[#F2F3FF] cursor-pointer rounded-[12px]`}
        >
          <File />
          <p className="mt-[12px] text-[#64717C] font-medium text-[18px] leading-[24px]">
            Sənədlər
          </p>
          <div className="mt-[12px] w-full bg-[#F9F9F9] rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-[#6926D7] h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="mt-[8px] flex justify-between items-center">
            <span className="text-[12px] text-t-gray leading-[16px]">
              62/100 GB
            </span>
            <span className="text-[12px] text-t-gray leading-[16px]">
              62%
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard/files/pictures"
          className={`${url === "/dashboard/files/pictures" ? "bg-[#E5F7FA]" :  "bg-white"} px-[14px] py-[24px] hover:bg-[#E5F7FA] cursor-pointer rounded-[12px]`}
        >
          <Picture />
          <p className="mt-[12px] text-[#64717C] font-medium text-[18px] leading-[24px]">
            Şəkillər
          </p>
          <div className="mt-[12px] w-full bg-[#F9F9F9] rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-[#31E4FF] h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="mt-[8px] flex justify-between items-center">
            <span className="text-[12px] text-t-gray leading-[16px]">
              62/100 GB
            </span>
            <span className="text-[12px] text-t-gray leading-[16px]">
              62%
            </span>
          </div>
        </Link>
        <Link href="/dashboard/files/audios" className={`${url === "/dashboard/files/audios" ? "bg-[#FFF1FC]" :  "bg-white"} px-[14px] py-[24px] hover:bg-[#FFF1FC] cursor-pointer rounded-[12px]`}>
          <Audio />
          <p className="mt-[12px] text-[#64717C] font-medium text-[18px] leading-[24px]">
            Audiolar
          </p>
          <div className="mt-[12px] w-full bg-[#F9F9F9] rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-[#D92DB1] h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="mt-[8px] flex justify-between items-center">
            <span className="text-[12px] text-t-gray leading-[16px]">
              62/100 GB
            </span>
            <span className="text-[12px] text-t-gray leading-[16px]">
              62%
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard/files/videos"
          className={`${url === "/dashboard/files/videos" ? "bg-[#FFF7E9]" :  "bg-white"} px-[14px] py-[24px] hover:bg-[#FFF7E9] cursor-pointer rounded-[12px]`}
        >
          <Video />
          <p className="mt-[12px] text-[#64717C] font-medium text-[18px] leading-[24px]">
            Videolar
          </p>
          <div className="mt-[12px] w-full bg-[#F9F9F9] rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-[#F5AB20] h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="mt-[8px] flex justify-between items-center">
            <span className="text-[12px] text-t-gray leading-[16px]">
              62/100 GB
            </span>
            <span className="text-[12px] text-t-gray leading-[16px]">
              62%
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
