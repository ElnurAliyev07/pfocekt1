"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";
import { User } from "@/types/auth.type";
import Image from "next/image";
import Portfolio from './Portfolio';
import { useSearchParams } from "next/navigation";
import { updateURLParam } from "@/utils/urlUtils";

interface ProfileProps {
  user?: User;
}

const OtherView: React.FC<ProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        Profil tapılmadı veya yüklənir...
      </div>
    );
  }
  const profile = user.user_profile;
  
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio">(tab as "overview" | "portfolio");

  // Sync activeTab with URL params
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "overview";
    setActiveTab(currentTab as "overview" | "portfolio");
  }, [searchParams]);

  const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Modern Profile Header Card */}
        <div className="bg-white shadow-lg overflow-hidden rounded-2xl">
          {/* Cover Section with Gradient */}
          <div className="relative">
            {profile.background_image ? (
              <div className="h-40 lg:h-56 relative overflow-hidden">
                <Image
                  src={profile.background_image}
                  alt="Profil arka planı"
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            ) : (
              <div className="h-40 lg:h-56 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
              </div>
            )}

            {/* Profile Content */}
            <div className="px-4 lg:px-8 pb-6 relative">
              {/* Profile Picture - float, left, between cover and card, responsive */}
              <div className="absolute -top-16 sm:-top-28 transform z-20">
                <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white">
                  {profile.image && (
                    <Image
                      src={profile.image}
                      alt={user.full_name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start pt-10 sm:pt-14 z-10 w-full md:justify-between">
                {/* Sol: Ana Bilgiler */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {user.full_name ? (
                      <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {user.full_name}
                      </h1>
                    ) : (
                      <div className="h-6 w-28 sm:h-7 sm:w-40 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
                    )}
                  </div>
                  {profile.profession ? (
                    <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium mb-2">
                      {profile.profession.name}
                    </p>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      <Briefcase className="w-3 h-3" /> Peşə əlavə edilməyib
                    </span>
                  )}
                  {profile.location ? (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">
                        {profile.location}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3" /> Şəhər əlavə edilməyib
                    </span>
                  )}
                </div>
                {/* Sağ: İstatistikler veya ek bilgiler */}
                <div className="flex flex-col md:flex-col items-center md:items-end md:gap-2 w-full md:w-auto md:mt-0">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all">
                      <MessageCircle className="w-4 h-4" />
                      Mesaj yaz
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold shadow transition-all">
                      <Share2 className="w-4 h-4" />
                      Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 mb-6 border-b border-gray-200">
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
            }`}
            onClick={() => { 
              setActiveTab("overview");
              updateURLParam("tab", "overview");
            }}
          >
            Ümumi
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "portfolio"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
            }`}
            onClick={() => { 
              setActiveTab("portfolio");
              updateURLParam("tab", "portfolio");
            }}
          >
            Portfolio
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Haqqında
                    </h2>
                  </div>
                  {!profile.description || profile.description.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                      <span className="text-gray-300 text-xs">
                        Hələ haqqında məlumat əlavə edilməyib.
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm leading-normal whitespace-pre-line">
                      {profile.description}
                    </p>
                  )}
                </div>

                {/* Experience Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Təcrübə
                    </h2>
                  </div>
                  {profile.experiences.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                      <span className="text-gray-300 text-xs">
                        Hələ təcrübə məlumatı əlavə edilməyib.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.experiences.map((exp) => (
                        <div key={exp.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            💼
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {exp.institution}
                            </div>
                            <div className="text-xs text-gray-600">
                              {exp.started_year} -{" "}
                              {exp.finished_year === 0
                                ? "İndi"
                                : exp.finished_year}
                            </div>
                            <div className="text-xs text-gray-500">
                              {exp.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Təhsil
                    </h2>
                  </div>
                  {profile.educations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                      <span className="text-gray-300 text-xs">
                        Hələ təhsil məlumatı əlavə edilməyib.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.educations.map((edu) => (
                        <div key={edu.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            🏫
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {edu.institution}
                            </div>
                            <div className="text-xs text-gray-600">
                              {edu.started_year} -{" "}
                              {edu.finished_year === 0
                                ? "İndi"
                                : edu.finished_year}
                            </div>
                            <div className="text-xs text-gray-500">
                              {edu.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                      Bacarıqlar
                    </h2>
                  </div>
                  {profile.skills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                      <span className="text-gray-300 text-xs">
                        Hələ bacarıq əlavə edilməyib.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={skill.id || idx}
                          className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-4 py-1 text-sm font-medium shadow-sm"
                        >
                          <span className="mr-2">⭐</span>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                {/* Languages Card */}
                {profile.user_languages.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-3 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                        Dillər
                      </h2>
                    </div>
                    {profile.user_languages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                        <span className="text-gray-400 text-xs">
                          Dillərinizi əlavə edin.
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {profile.user_languages.map((lang, idx) => (
                          <div
                            key={lang.id || idx}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">
                                {lang.language?.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                              {lang.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {profile?.is_freelancer && profile.salaries.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold text-primary-900">
                        Xidmət haqqı
                      </h3>
                    </div>
                    <div className="space-y-2 mt-2">
                      {profile.salaries.length === 0 ? (
                        <div className="p-2 rounded-lg border border-dashed border-gray-200 text-center shadow-none">
                          <span className="text-gray-300 text-xs">
                            Hələ xidmət haqqı əlavə edilməyib.
                          </span>
                        </div>
                      ) : (
                        profile.salaries
                          .filter((salary) => salary.is_visible)
                          .map((salary, key) => (
                            <div
                              key={key}
                              className="p-2 rounded-lg border border-primary-200"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-primary-900">
                                  {salary.salary_type === "monthly"
                                    ? "Aylıq"
                                    : "Layihə"}
                                </span>
                                <span className="text-base font-bold text-primary-700">
                                  {salary.amount} / AZN
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}


              </div>
            </div>
        ) : (activeTab === "portfolio") ? (
          <Portfolio isOwner={false} user={user} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default OtherView;
