"use client";

import React, { useEffect } from "react";
import SearchInput from "../inputs/Search";
import { debounce } from "@/utils/debounceUtils";
import ProjectItem from "../common/ProjectItem";
import useProjectStore from "@/store/projectStore";
import CreateProjectModal from "../modals/CreateProject";
import Search from "@/components/ui/icons/Search";
import Adjust from "@/app/(default)/packages/components/ui/icons/Adjust";
import { clearURLParams, updateURLParam } from "@/utils/urlUtils";
import { useSearchParams } from "next/navigation";
import { BiRefresh } from "react-icons/bi";
import Image from "next/image";

const Projects = () => {
  const {
    projects,
    isLoading,
    isFiltered,
    resetStore,
    setSearchQuery,
    fetchProjects,
    workspaceSlug
  } = useProjectStore();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const handleSearch = debounce(async (query: string) => {
    setSearchQuery(query);
    updateURLParam("search", query);
    fetchProjects(true);
  }, 300);

  useEffect(() => {
    if (!workspaceSlug) return;
    const loadProjects = async () => {
      await fetchProjects(true);
    };
    loadProjects();
  }, [workspaceSlug]);


  return (
    <div className="mt-[20px] md:mt-[42px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex gap-[30px] mb-[40px] md:mb-0 flex-col md:flex-row md:items-center">
          <h3 className="text-[18px] md:text-[24px] font-semibold leading-[24px] md:leading-[32px]">
            Proyektlər
          </h3>
          {(isFiltered || projects.length > 0) && (
            <>
              <div className="hidden md:flex-row flex-col gap-[8px] md:flex">
                <SearchInput
                  placeholder="Axtar..."
                  onSearch={handleSearch}
                  defaultValue={searchQuery}
                />
              </div>
              <div className="flex justify-between md:hidden  gap-[12px] max-w-full overflow-x-hidden">
                <div className="flex items-center py-3 pl-[16px] pr-[34px] bg-white border rounded-[8px] w-[calc(100%-60px)] gap-[8px]">
                  <Search />
                  <input
                    type="text"
                    placeholder="Sizə maraqlı olanı axtarın"
                    className="bg-transparent outline-hidden placeholder-t-gray-500 text-t-gray w-full"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <button className="md:hidden w-[48px] h-[48px] rounded-[8px] bg-white border justify-center flex items-center cursor-pointer shrink-0">
                  <Adjust />
                </button>
              </div>{" "}
            </>
          )}
        </div>
        {(isFiltered || projects.length > 0) && (
        <CreateProjectModal />
        )}
      </div>

      {isLoading ? (
        <div className="mt-[24px] md:mt-[64px] flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectItemSkeleton key={index} />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="mt-[24px] md:mt-[64px] flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {projects.map((project, index) => (
            <ProjectItem project={project} key={index} />
          ))}
        </div>
      ) : (
        <>
          {!isFiltered && projects.length === 0 && (
            <div className="mt-[24px] flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 opacity-30"></div>

              {/* Illustration */}
              <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <Image
                    width={192}
                    height={192}
                    alt="Layihə"
                    className="w-full h-full object-contain"
                    src="/dashboard/workspace-detail.svg"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3 text-left relative z-10">
                <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-3">
                  {projects.length === 0
                    ? "Layihə yoxdur"
                    : "Uyğun layihə tapılmadı"}
                </div>

                <h3 className="text-[22px] font-semibold text-t-black mb-4">
                  {projects.length === 0
                    ? "Bu virtual ofisdə layihələr yaradın"
                    : "Axtarışınıza uyğun layihə tapılmadı"}
                </h3>

                <div className="space-y-4 mb-6 max-w-lg">
                  <p className="text-[15px] text-slate-600">
                    {projects.length === 0
                      ? "Layihələr komandanızın işlərini təşkil etməyə kömək edir. Hər bir layihə müxtəlif tapşırıqları və məqsədləri özündə birləşdirir."
                      : "Axtarış parametrlərinizi dəyişdirərək və ya yeni bir layihə yaradaraq davam edə bilərsiniz."}
                  </p>

                  {projects.length === 0 && (
                    <ul className="space-y-2">
                      {[
                        "Tapşırıqları bölüşdürün və izləyin",
                        "Müddətləri və prioritetləri təyin edin",
                        "Layihə irəliləyişini izləyin",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-[14px] text-slate-700">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {projects.length === 0 && (
                  <CreateProjectModal containerClassName="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Proyekt yarat
                  </CreateProjectModal>
                )}
              </div>
            </div>
          )}

          {isFiltered && projects.length === 0 && (
            <div className="mt-[36px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-30"></div>

              <Search className="w-16 h-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Axtardığınız workspace tapılmadı
              </h3>
              <p className="text-blue-600 mb-6 max-w-md">
                Heç bir nəticə tapılmadı. Filterləri sıfırlayaraq bütün mövcud
                workspaceləri görə bilərsiniz.
              </p>

              <button
                onClick={() => {
                  resetStore();
                  clearURLParams();
                  fetchProjects(true);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all flex items-center gap-2"
              >
                <BiRefresh className="w-4 h-4" />
                Filterləri Sıfırla
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ProjectItemSkeleton = () => {
  return (
    <div className="w-full h-[120px] bg-gray-200 rounded-[8px] animate-pulse"></div>
  );
};

export default Projects;
