"use client"

import type React from "react"
import { useState } from "react"
import Employees from "../ui/icons/Employees"
import Star from "../ui/icons/Star"
import Calendar from "../ui/icons/Calendar"
import Wallet from "../ui/icons/Wallet"
import ApplyBtn from "../ui/buttons/ApplyBtn"
import Link from "next/link"
import AIPackageInterestModal from "./AIPackageInterestModal"

interface PackageItemProps {
  item: {
    id?: number | string
    name?: string
    description?: string
    price?: number
    price_range?: string
    period?: number
    rating?: number
    freelancer_count?: number
    slug?: string
    is_ai_suggested?: boolean
    package_freelancer_professions?: Array<{
      id?: number | string
      freelancer_profession?: {
        name?: string
      }
      freelancer_count?: number
      average_rating?: number
    }>
  } | null
}

const PackageItem: React.FC<PackageItemProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  if (!item) return null
  

  
  return (
    <>
    <div className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden flex flex-col relative">
      {/* AI Badge - removed as per user request */}
      
      {/* Simge Alanı */}
      <div className="h-28 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
        <div className="text-4xl font-semibold text-indigo-600">{item.name}</div>
      </div>

      {/* İçerik */}
      <div className="p-6 flex flex-col flex-grow">
        {/* <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.name}</h3> */}

        {/* Meslekler */}
        <div className="flex flex-col gap-3 mb-4">
          {item.package_freelancer_professions?.map((profession) => (
              <div
                key={`prof-${profession.id || "unknown"}-${profession.freelancer_profession?.name || "prof"}`}
                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {profession.freelancer_profession?.name || "Unknown Profession"}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  {/* Freelancer Count - həmişə göstər əgər varsa */}
                  {(profession.freelancer_count !== null && profession.freelancer_count !== undefined) && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <div className="bg-indigo-100 w-5 h-5 rounded flex items-center justify-center">
                        <Employees className="w-3 h-3" />
                      </div>
                      <span className="font-medium">{profession.freelancer_count} nəfər</span>
                    </div>
                  )}
                  {/* Average Rating - həmişə göstər əgər varsa */}
                  {(profession.average_rating !== null && profession.average_rating !== undefined) && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <div className="bg-yellow-100 w-5 h-5 rounded flex items-center justify-center">
                        <Star className="w-3 h-3" />
                      </div>
                      <span className="font-medium">
                        {typeof profession.average_rating === 'number' 
                          ? profession.average_rating.toFixed(1) 
                          : profession.average_rating} ulduz
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Bilgiler */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-6">
            {item.freelancer_count && item.freelancer_count > 0 && (
              <div className="flex items-center gap-2">
                <div className="bg-indigo-50 w-8 h-8 rounded-md grid place-items-center">
                  <Employees />
                </div>
                <span className="text-gray-700 font-medium">{item.freelancer_count} Nəfər</span>
              </div>
            )}
            {item.rating && item.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="bg-yellow-50 w-8 h-8 rounded-md grid place-items-center">
                  <Star />
                </div>
                <span className="text-gray-700 font-medium">{item.rating} Ulduz</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            {item.period !== undefined && item.period > 0 && (
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 w-8 h-8 rounded-md grid place-items-center">
                  <Calendar />
                </div>
                <span className="text-gray-700 font-medium">{item.period} Gün</span>
              </div>
            )}
            {(item.price !== undefined || item.price_range) && (
              <div className="flex items-center gap-2">
                <div className="bg-green-50 w-8 h-8 rounded-md grid place-items-center">
                  <Wallet />
                </div>
                <span className="text-gray-700 font-medium">{item.price || item.price_range} AZN</span>
              </div>
            )}
          </div>
        </div>

        {/* Butonlar */}
        <div className="mt-auto grid grid-cols-2 gap-4">
          <ApplyBtn />
          {item.is_ai_suggested ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-[44px] items-center justify-center border border-purple-500 hover:border-purple-600 text-purple-600 hover:text-purple-700 rounded-lg px-4 font-medium text-sm transition gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Maraq göstər
            </button>
          ) : (
            <Link
              href={`/packages/${item.slug}`}
              className="flex h-[44px] items-center justify-center border border-indigo-500 hover:border-indigo-600 text-indigo-600 hover:text-indigo-700 rounded-lg px-4 font-medium text-sm transition"
            >
              Daha çox
            </Link>
          )}
        </div>
      </div>
    </div>

    {/* AI Interest Modal */}
    {item.is_ai_suggested && (
      <AIPackageInterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageName={item.name || "Bu paket"}
        packagePrice={item.price || item.price_range}
        packagePeriod={item.period}
        packageId={item.id}
      />
    )}
    </>
  )
}

export default PackageItem
