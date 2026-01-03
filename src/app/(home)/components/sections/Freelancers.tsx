// Import Swiper modules
import Image from "next/image";
import { ExpertSection } from "@/types/home.type";

interface Props {
  data: ExpertSection;
}

const Freelancers: React.FC<Props> = ({ data }) => {
  return (
    <section className="mt-[80px] md:mt-[100px] lg:mt-[100px] custom-container md:h-[517px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[24px] md:text-[36px] leading-[32px] md:leading-[44px] text-t-black dark:text-text-dark-black font-semibold">
          Ekspertlər
        </h3>
      </div>
      <div className="mt-[36px] md:mt-[48px] md:grid h-full lg:grid-cols-2 md:gap-[24px]">
        <div className="">
          <Image
            className="md:h-full md:w-auto"
            src={data.image}
            width={2000}
            height={2000}
            alt="freelancer"
          />
        </div>
        <div className="flex flex-col mt-[36px] lg:mt-0">
          <h4 className="text-[20px] leading-[28px] md:text-[32px] md:leading-[32px] font-semibold text-t-black dark:text-text-dark-black ">
            {data.title}
          </h4>
          <p className="text-[12px] md:text-[16px] mt-[12px] md:font-normal font-normal  md:mt-[16px] leading-[16px] md:leading-[24px] text-t-gray dark:text-text-dark-black">
            {data.description}
          </p>
          <div className="mt-[24px] md:mt-[52px] space-y-[24px]">
            {data.punkts?.map((item, index) => (
              <div key={index}>
                <div className="flex items-center md:gap-[12px]">
                  {item.count && (
                    <span className="md:border-b border-primary text-[20px] md:text-[32px] font-semibold md:font-medium p-[4px] text-primary dark:text-text-dark-black">
                      {item.count}
                    </span>
                  )}
                  {item.title && (
                    <span className="text-[20px] leading-[26px] font-medium text-t-black dark:text-text-dark-black">
                      {item.title}
                    </span>
                  )}
                </div>
                  {item.description && (
                <p className="text-[12px] md:text-[16px] mt-[12px] md:mt-[16px] leading-[24px] text-t-gray dark:text-text-dark-black">
                  {item.description}
                </p>
              )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Freelancers;
