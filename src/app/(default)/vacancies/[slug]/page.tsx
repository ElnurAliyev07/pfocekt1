import AxesRight from "@/components/ui/icons/AxesRight";
import Image from "next/image";
import React from "react";
import Location from "./components/ui/icons/Location";
import Date from "./components/ui/icons/Date";
import Watch from "./components/ui/icons/Watch";
import Wallet from "./components/ui/icons/Wallet";
import Join from "./components/ui/buttons/Join";
import Clock from "./components/ui/icons/Clock";
import WorkRegime from "./components/ui/icons/WorkRegime";
import Tick from "./components/ui/icons/Tick";
import { notFound } from "next/navigation";
import { getVacancyDetailService } from "@/services/server/vacancy.service";
import { formatDateOnly } from "@/utils/formateDateTime";
import Link from "next/link";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  try {
    const vacancy = await getVacancyDetailService(slug);
    return (
      <section className="custom-container pt-[84px] md:pt-[148px]">
        <p className="mb-[32px] md:mb-12 flex items-center gap-1">
          <Link href={"/workspaces"} className="text-t-gray text-[12px] md:text-[14px]">Vakansiyalar</Link>
          <AxesRight />
          <span className="text-t-black text-[12px] md:text-[14px]">{vacancy.data.title}</span>
        </p>
        <div className="bg-white rounded-[20px]">
          <div className="px-[8px] py-[40px] lg:p-[45px]">
            <div className="flex items-center gap-[12px] md:gap-[24px]">
              <Image
                src="/grid.png"
                className="w-[56px] h-[56px] md:w-[100px] md:h-[100px] rounded-full object-cover"
                width={1000}
                height={1000}
                alt="profile img"
              />
              <div className="space-y-[10px] md:space-y-[20px]">
                <h2 className="text-[18px] md:text-[32px] text-t-black font-medium leading-[24px] md:leading-[40px]">
                  {vacancy.data.title}
                </h2>
                <h4 className="text-primary text-[14px] md:text-[20px] font-medium md:pr-[8px] mr-[8px]">
                  {vacancy.data.establishment}
                </h4>
              </div>
            </div>
            <div className="flex gap-[8px] mt-[40px] md:hidden">
              <Date width={20} height={20} />
              <div>
                <h3 className="text-t-black text-[14px]">{formatDateOnly(vacancy.data.started)}</h3>
                <p className="text-t-gray text-[12px]">Elan tarixi</p>
              </div>
              <div className="ml-6">
                <h3 className="text-t-black text-[14px]">{formatDateOnly(vacancy.data.ended)}</h3>
                <p className="text-t-gray text-[12px]">Bitmə tarixi</p>
              </div>
            </div>
            <div className="mt-[32px] md:mt-[72px] rounded-[20px] md:border border-borderDefault md:py-[40px] md:px-[36px]">
              <div>
                <div className="hidden md:flex gap-[8px] mt-[32px] mb-[36px]">
                  <Date />
                  <div>
                    <h3 className="text-t-black text-[20px]">{formatDateOnly(vacancy.data.started)}</h3>
                    <p className="text-t-gray">Elan tarixi</p>
                  </div>
                  <div className="ml-8">
                    <h3 className="text-t-black text-[20px]">{formatDateOnly(vacancy.data.ended)}</h3>
                    <p className="text-t-gray">Bitmə tarixi</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-[#ECEDFF] rounded-[10px] text-primary py-[10px] px-[20px] text-[16px] md:text-[24px] md:h-[52px] font-medium leading-[32px]">
                    {vacancy.data.title}
                  </div>
                </div>
                <div className="grid grid-cols-3 lg:flex lg:gap-[48px]">
                  {
                    vacancy.data.location &&
                    <div className="flex gap-[8px] mt-[32px]">
                      <div className="hidden md:block">
                        <Location />
                      </div>
                      <div className="block md:hidden">
                        <Location width={20} height={20} />
                      </div>

                      <div>
                        <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.data.location}</h3>
                        <p className="text-t-gray text-[12px] md:text-[16px]">Adress</p>
                      </div>
                    </div>
                  }
                  {
                    vacancy.data.view_count > 0 &&
                    <div className="flex gap-[8px] mt-[32px]">
                      <div className="hidden md:block">
                        <Watch />
                      </div>
                      <div className="block md:hidden">
                        <Watch width={20} height={20} />
                      </div>

                      <div>
                        <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.data.view_count}</h3>
                        <p className="text-t-gray text-[12px] md:text-[16px]">Baxış sayı</p>
                      </div>
                    </div>
                  }
                  {
                    vacancy.data.salary &&
                    <div className="flex gap-[8px] mt-[32px]">
                      <div className="hidden md:block">
                        <Wallet />
                      </div>
                      <div className="block md:hidden">
                        <Wallet width={20} height={20} />
                      </div>
                      <div>
                        <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.data.salary} AZN</h3>
                        <p className="text-t-gray text-[12px] md:text-[16px]">Əmək haqqı</p>
                      </div>
                    </div>
                  }

                  {vacancy.data.work_schedulers.length > 0 &&
                    <div className="flex gap-[8px] mt-[32px]">
                      <div className="hidden md:block">
                        <Clock />
                      </div>
                      <div className="block md:hidden">
                        <Clock width={20} height={20} />
                      </div>
                      <div>
                        <h3 className="text-t-black text-[16px] md:text-[20px]">İş saatı</h3>
                        <p className="text-t-gray text-[12px] md:text-[16px]">
                          {
                            vacancy.data.work_schedulers.map((item, index) => (
                              <span key={index}>{item.title}{index !== vacancy.data.work_schedulers.length - 1 && ','}</span>
                            ))
                          }
                        </p>
                      </div>
                    </div>
                  }
                  {vacancy.data.work_schedulers.length > 0 &&

                    <div className="flex gap-[8px] mt-[32px]">
                      <div className="hidden md:block">
                        <WorkRegime />
                      </div>
                      <div className="block md:hidden">
                        <WorkRegime width={20} height={20} />
                      </div>
                      <div>
                        <h3 className="text-t-black text-[16px] md:text-[20px]">İş rejimi</h3>
                        <p className="text-t-gray text-[12px] md:text-[16px]">
                          {
                            vacancy.data.work_modes.map((item, index) => (
                              <span key={index}>{item.title}{index !== vacancy.data.work_modes.length - 1 && ','}</span>
                            ))
                          }
                        </p>
                      </div>
                    </div>
                  }
                  {
                    (vacancy.data.experience_start || vacancy.data.experience_finish) ? (
                      <div className="flex gap-[8px] mt-[32px]">
                        <div className="hidden md:block">
                          <Tick />
                        </div>
                        <div className="block md:hidden">
                          <Tick width={20} height={20} />
                        </div>
                        <div>
                          <h3 className="text-t-black text-[16px] md:text-[20px]">Təcrübə</h3>
                          <p className="text-t-gray text-[12px] md:text-[16px]">{vacancy.data.experience_start}{(vacancy.data.started && vacancy.data.experience_finish) ? '-' : ''}{vacancy.data.experience_finish} il</p>
                        </div>
                      </div>
                    ) : ''
                  }

                </div>
              </div>
              {vacancy.data.vacancy_descriptions.length > 0 &&
                <div className="mt-[48px] md:mt-[56px]">
                  <h3 className="text-t-black text-[20px] md:text-[24px] font-medium leading-[28px] md:leading-[32px]">
                    İş barədə məlumat
                  </h3>
                  <ul className="mt-[24px] md:mt-[20px] flex flex-col gap-3">
                    {vacancy.data.vacancy_descriptions.map((item, index) => (
                      <li key={index} className="flex items-center text-[12px] leading-[20px] gap-[10px] md:text-[18px] md:leading-[28px] text-t-gray">
                        {
                          vacancy.data.vacancy_descriptions.length > 1 &&
                          <div className="w-[8px] h-[8px] rounded-full bg-primary inline-block lg:block"></div>
                        }
                        <span>
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              }

              {vacancy.data.vacancy_requirements.length > 0 &&
                <div className="mt-[32px]">
                  <h3 className="text-t-black text-[20px] md:text-[24px] font-medium leading-[28px] md:leading-[32px]">
                    Tələblər
                  </h3>
                  <ul className="mt-[24px] md:mt-[20px] flex flex-col gap-3">
                    {vacancy.data.vacancy_requirements.map((item, index) => (
                      <li key={index} className="flex items-center text-[12px] leading-[20px] gap-[10px] md:text-[18px] md:leading-[28px] text-t-gray">
                        {
                          vacancy.data.vacancy_requirements.length > 1 &&
                          <div className="w-[8px] h-[8px] rounded-full bg-primary inline-block lg:block"></div>
                        }
                        <span>
                          {item.requirement}
                        </span>
                      </li>
                    ))}

                  </ul>
                </div>
              }
            </div>
            <div className="flex md:block mt-9 md:text-end">
              <Join />
            </div>
          </div>
        </div>
      </section>
    );
  } catch {
    notFound()
  }

};

export default page;
