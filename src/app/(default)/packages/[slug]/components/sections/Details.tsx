"use client"

import type React from "react"
import ApplyBtn from "../ui/buttons/ApplyBtn"
import ShareBtn from "../ui/buttons/ShareBtn"
import Star from "../../../components/ui/icons/Star"
import Employees from "../../../components/ui/icons/Employees"
import Calendar from "../../../components/ui/icons/Calendar"
import Wallet from "../../../components/ui/icons/Wallet"
import SendMessage from "../ui/buttons/SendMessage"
import JoinPackage from "../ui/buttons/JoinPackage"
import CheckMark from "../ui/icons/CheckMark"
import Portfolio from "../common/Portfolio"
import type { Package } from "@/types/package.type"

interface Props {
  item: Package
}

const Details: React.FC<Props> = ({ item }) => {
  return (
    <div className="pt-[100px] pb-[32px] px-[12px] md:pt-[120px] md:pb-[64px] md:px-[32px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-[20px] md:gap-[32px] mb-[20px] lg:mb-0">
          <h2 className="text-[24px] md:text-[40px] font-medium md:font-semibold text-t-black leading-[32px] md:leading-[48px]">
            {item.name}
          </h2>
          <div className="w-[121px] md:w-auto text-primary text-[14px] md:text-[20px] font-medium leading-[20px] md:leading-[28px] bg-[#F1F1FF] py-[10px] px-[16px] rounded-[8px]">
            Nəticə əsaslı
          </div>
        </div>
        <div className="flex items-center gap-[13px] md:gap-[16px]">
          <ApplyBtn />
          <ShareBtn />
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: item.description }}
        className="mt-[20px] md:mt-[40px] lg:mt-[64px] text-t-gray text-[14px] md:text-[20px] lg:text-[24px] font-normal leading-[20px] md:leading-[32px]"
      ></div>
      <div className="mt-[22px] md:mt-[40px] flex flex-wrap gap-[10px] md:gap-[20px]">
        {item.package_freelancer_professions.map((item, index) => (
          <div
            key={index}
            className="rounded-[5px] md:rounded-[8px] py-[12px] text-[12px] md:text-[16px] px-[16px] flex items-center bg-[#D7D9DD40]/25"
          >
            {item.freelancer_profession.name}
          </div>
        ))}
      </div>
      <div className="max-w-[255px] md:max-w-full mt-[32px] md:mt-[40px] grid grid-cols-2 md:flex gap-[28px] md:gap-[40px]">
        {item.rating > 0 && (
          <div className="flex gap-[8px]">
            <Star className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]" />
            <div>
              <h3 className="text-t-black text-[16px] md:text-[20px]">{item.rating} ulduz</h3>
              <p className="text-t-gray text-[12px] md:text-[16px]">Reytinq</p>
            </div>
          </div>
        )}
        {item.freelancer_count > 0 && (
          <div className="flex gap-[8px]">
            <Employees className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]" />
            <div>
              <h3 className="text-t-black text-[16px] md:text-[20px]">{item.freelancer_count} nəfər</h3>
              <p className="text-t-gray text-[12px] md:text-[16px]">Əməkdaş sayı</p>
            </div>
          </div>
        )}
        {item.period && (
          <div className="flex gap-[8px]">
            <Calendar className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]" />
            <div>
              <h3 className="text-t-black text-[16px] md:text-[20px]">{item.period} gün</h3>
              <p className="text-t-gray text-[12px] md:text-[16px]">Müddət</p>
            </div>
          </div>
        )}
        {item.price || item.price_range ? (
          <div className="flex gap-[8px]">
            <Wallet className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]" />
            <div>
              <h3 className="text-t-black text-[16px] md:text-[20px]">{item.price || item.price_range} AZN</h3>
              <p className="text-t-gray text-[12px] md:text-[16px]">Əmək haqqı</p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <ul className="mt-[32px] md:mt-[40px] lg:mt-[72px] space-y-[8px] md:space-y-[12px]">
        <h1 className="mb-[24px] block text-[20px] leading-[28px] font-medium md:hidden">Şərtlər</h1>
        {item.package_requirements.map((requirement, index) => (
          <li key={index} className="flex md:items-center gap-[8px] md:gap-[12px]">
            <span className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] bg-primary rounded-full flex items-center justify-center py-[4px] px-[2px] md:p-0">
              <CheckMark />
            </span>
            <span className="text-[12px] md:text-[20px] leading-[16px] md:leading-[28px] text-t-black">
              {requirement.requirement}
            </span>
          </li>
        ))}
      </ul>
      {/* Xüsusiyyətlər */}
      {item.features && item.features.length > 0 && (
        <>
          <h3 className="mt-[40px] md:mt-[72px] text-[24px] md:text-[32px] text-t-black font-medium leading-[32px] md:leading-[40px]">
            Xüsusiyyətlər
          </h3>
          <div className="mt-[24px] md:mt-[32px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {item.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-[12px] p-[16px] bg-gray-50 rounded-[8px]">
                <span className="w-[20px] h-[20px] bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-[2px]">
                  <CheckMark />
                </span>
                <span className="text-[14px] md:text-[16px] text-t-black">{feature}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Freelancerlər */}
      {item.freelancers && item.freelancers.length > 0 && (
        <>
          <h3 className="mt-[40px] md:mt-[72px] text-[24px] md:text-[32px] text-t-black font-medium leading-[32px] md:leading-[40px]">
            Komanda Üzvləri
          </h3>
          <div className="mt-[24px] md:mt-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {item.freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white border border-gray-200 rounded-[12px] p-[20px] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-[12px] mb-[16px]">
                  <img
                    src={freelancer.avatar || "/user.png"}
                    alt={freelancer.name}
                    className="w-[56px] h-[56px] rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-[16px] md:text-[18px] font-medium text-t-black">{freelancer.name}</h4>
                    <p className="text-[12px] md:text-[14px] text-t-gray">{freelancer.profession}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <div className="flex items-center gap-[4px]">
                    <Star className="w-[16px] h-[16px]" />
                    <span className="text-t-black font-medium">{freelancer.rating}</span>
                  </div>
                  <span className="text-t-gray">{freelancer.completed_projects} layihə</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Portfel */}
      <h3 className="mt-[40px] md:mt-[72px] text-[24px] md:text-[32px] text-t-black font-medium leading-[32px] md:leading-[40px]">
        Portfel
      </h3>
      <div className="mt-[32px]">
        {item.package_portfolios.length > 0 && (
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[37.5px]">
            {item.package_portfolios.map((portfolio, index) => (
              <Portfolio key={index} portfolio={portfolio} />
            ))}
          </div>
        )}
      </div>

      {/* Rəylər */}
      {item.reviews && item.reviews.length > 0 && (
        <>
          <h3 className="mt-[40px] md:mt-[72px] text-[24px] md:text-[32px] text-t-black font-medium leading-[32px] md:leading-[40px]">
            Rəylər
          </h3>
          <div className="mt-[24px] md:mt-[32px] space-y-[20px]">
            {item.reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-[12px] p-[20px]">
                <div className="flex items-start gap-[12px]">
                  <img
                    src={review.user.avatar || "/user.png"}
                    alt={review.user.name}
                    className="w-[48px] h-[48px] rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-[8px]">
                      <h4 className="text-[16px] font-medium text-t-black">{review.user.name}</h4>
                      <div className="flex items-center gap-[4px]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-[16px] h-[16px] ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[14px] text-t-gray mb-[8px]">{review.comment}</p>
                    <span className="text-[12px] text-t-gray">
                      {new Date(review.created_at).toLocaleDateString("az-AZ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Oxşar Paketlər */}
      {item.similar_packages && item.similar_packages.length > 0 && (
        <>
          <h3 className="mt-[40px] md:mt-[72px] text-[24px] md:text-[32px] text-t-black font-medium leading-[32px] md:leading-[40px]">
            Oxşar Paketlər
          </h3>
          <div className="mt-[24px] md:mt-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {item.similar_packages.map((pkg) => (
              <a
                key={pkg.id}
                href={`/packages/${pkg.slug}`}
                className="bg-white border border-gray-200 rounded-[12px] p-[20px] hover:shadow-md transition-all"
              >
                <h4 className="text-[18px] font-medium text-t-black mb-[12px]">{pkg.name}</h4>
                <div className="flex items-center justify-between text-[14px]">
                  <div className="flex items-center gap-[8px]">
                    <Star className="w-[16px] h-[16px]" />
                    <span className="text-t-black">{pkg.rating}</span>
                  </div>
                  <span className="text-primary font-medium">{pkg.price} AZN</span>
                </div>
                {pkg.period && (
                  <div className="mt-[8px] text-[12px] text-t-gray">{pkg.period} gün</div>
                )}
              </a>
            ))}
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-[56px] md:mt-[64px] flex justify-end gap-[14px] md:gap-[24px]">
        <SendMessage />
        <JoinPackage />
      </div>
    </div>
  )
}

export default Details
