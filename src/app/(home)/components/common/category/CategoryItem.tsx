// import AxesTopRight from "@/components/ui/icons/AxesTopRight";
import { Category } from "@/types/home.type";
import Image from "next/image";
import React from "react";

interface Props {
  item: Category;
}

const CategoryItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-secondary-dark md:h-[392px] rounded-[20px] px-[24px] py-[32px]">
      <div className="flex w-full justify-between gap-[48px]">
        <div className="flex flex-col gap-[8px] md:gap-[4px] w-[75%]">
          <h3 className="text-[16px] md:text-[20px] font-semibold leading-[28px] text-text-black dark:text-text-dark-black">
            {item.name}
          </h3>
          <p className="text-[12px] md:text-[14px] font-normal md:font-medium leading-[16px] md:leading-[20px] text-t-gray dark:text-text-dark-black">
            {item.small_description}
          </p>
        </div>
        {/* <a className="cursor-pointer w-[40px] h-[40px] rounded-full bg-[#EFF0FF] hover:bg-primary group grid place-items-center">
          <AxesTopRight className="group-hover:fill-white fill-primary" />
        </a> */}
      </div>
      {
        item.freelancer_count && (
          <p className="mt-[16px] md:mt-[24px] text-[20px] font-medium text-text-black dark:text-text-dark-black">
            {item.freelancer_count} üzv
          </p>
        )
      }
      
      <div className="mt-[24px] md:mt-[32px]  grid place-items-center grow">
        <Image
          className="w-[164px] h-[164px] object-cover md:rounded-[12px]"
          width={1000}
          height={1000}
          src={item.file}
          alt={item.name}
        />
      </div>
    </div>
  );
};

export default CategoryItem;
