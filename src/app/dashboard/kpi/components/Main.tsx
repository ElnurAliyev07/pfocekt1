'use client'

import React, { useState } from "react";
import { Tabs } from "@/components/ui";
import SectionWrapper from "@/components/common/wrappers/SectionWrapper";

const Main = () => {
  const [activeTab, setActiveTab] = useState<string>("0");

  return (
    <div className="flex flex-col gap-4">
      <Tabs.Tabs 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key)}
        variant="underline"
      >
        <Tabs.TabList>
          <Tabs.Tab id="0">Əsas Parametrlər Üzrə</Tabs.Tab>
          <Tabs.Tab id="1">Digər Parametrlər Üzrə</Tabs.Tab>
        </Tabs.TabList>
        
        <Tabs.TabPanels>
          <Tabs.TabPanel id="0">
            <SectionWrapper disabled>
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">
                    Əsas Parametrlər Üzrə
                  </th>
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">Bal</th>
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">Nəticə</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Paylaşımların vaxtında tam icrası:
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">10 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Gecikmələrə uyğun davranış
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">5 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Bütün müştərilər üzrə orqanik reach hədəfinə çatmaq
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">20 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Komanda yoldaşları ilə kommunikasiya sürəti (ortalama 30
                    dəqiqə içərisində)
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">10 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Kommunikasiyanın keyfiyyəti (davranış, problem həll edə bilmə
                    və s.)
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">10 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Gündəlik sərf edilmiş iş saatının həcmi
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">10 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">Davamiyyət</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Full time-10 bal <br /> Evdən -8 bal
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Full time- 70%
                  </td>
                </tr>
              </tbody>
            </table>
            </SectionWrapper>
          </Tabs.TabPanel>
          
          <Tabs.TabPanel id="1">
          <SectionWrapper disabled>
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">
                    Digər parametrlər üzrə{" "}
                  </th>
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">Bal</th>
                  <th className="text-[18px] pt-4 pr-6 pb-4 pl-6">Nəticə</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Mürəkkəb Tapşırıqların İcrası
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">15 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Təşəbbüskarlıq və yenilik
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">15 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Müştərilərlə kommuniyasiya sürəti (ortalama 30 dəqiqə
                    içərisində)
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">15 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Çətin vəziyyətləri idarə edə bilmək
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">15 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">
                    Digər komanda yoldaşlarına dəstək vermək
                  </td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">10 bal</td>
                  <td className="text-center pt-4 pr-6 pb-4 pl-6">70%</td>
                </tr>
              </tbody>
            </table>
            </SectionWrapper>
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs.Tabs>
    </div>
  );
};

export default Main;
