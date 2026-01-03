"use client";

import useTaskStore from "@/store/taskStore";
import React, { useEffect } from "react";
import TaskItem from "../common/TaskItem";
import SearchInput from "../inputs/Search";
import CreateTaskModal from "../modals/CreateTask";
import { useSearchParams } from "next/navigation";
import { updateURLParam } from "@/utils/urlUtils";
import Search from "@/components/ui/icons/Search";
import { BiRefresh } from "react-icons/bi";
import TaskItemSkeleton from "../common/TaskItemSkeleton";
import Image from "next/image";
import { debounce } from "@/utils/debounceUtils";
import useProjectMemberStore from "@/store/projectMemberStore";

const Tasks: React.FC = () => {
  const { tasks, isFiltered, isLoading, setSearchQuery, fetchTasks } =
    useTaskStore();
  
  

  const params = useSearchParams();
  const searchQuery = params.get("search") || "";

  const handleSearch = debounce(async (query: string) => {
    setSearchQuery(query);
    updateURLParam("search", query);
    await fetchTasks(true);
  }, 300);

  
  
 
  // Determine if we're showing filters or not

  return (
    <div className="mt-[20px] md:mt-[42px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[30px] items-start sm:items-center w-full sm:w-auto">
          <h3 className="text-[20px] sm:text-[24px] font-semibold leading-[32px]">
            Tasklar
          </h3>

          {(tasks.length > 0 || isFiltered) && (
            <div className="flex gap-[8px] w-full sm:w-auto">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Task axtar"
                className="w-full sm:w-auto"
              />
            </div>
          )}
        </div>

        {(tasks.length > 0 || isFiltered) && (
          <CreateTaskModal isOpenProps={params.get("isOpen") === "true"} />
        )}
      </div>

      {isLoading ? (
        <div className="mt-[32px] sm:mt-[64px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px]">
          {[1, 2, 3].map((item) => (
            <TaskItemSkeleton key={item} />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="mt-[32px] sm:mt-[64px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px]">
          {tasks.map((task, index) => (
            <TaskItem key={index} task={task} />
          ))}
        </div>
      ) : (
        <>
          {!isFiltered && tasks.length === 0 && (
            <div className="mt-[36px] flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 opacity-30"></div>

              {/* Illustration */}
              <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <Image
                    width={192}
                    height={192}
                    src="/dashboard/workspace-detail.svg"
                    alt="Task"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3 text-left relative z-10">
                <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-3">
                  Task yoxdur
                </div>

                <h3 className="text-[22px] font-semibold text-t-black mb-4">
                  Bu proyektdə tasklar yaradın
                </h3>

                <div className="space-y-4 mb-6 max-w-lg">
                  <p className="text-[15px] text-slate-600">
                    Tasklar proyektinizin məqsədlərinə çatmaq üçün əsas
                    addımlardır. Komandanızın işlərini təşkil edin və izləyin.
                  </p>

                  <ul className="space-y-2">
                    {[
                      "İşlərinizi kiçik hissələrə bölün",
                      "Müddətləri və prioritetləri təyin edin",
                      "Task statusunu izləyin",
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
                </div>
                <CreateTaskModal isOpenProps={params.get("isOpen") === "true"}
                containerClassName="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow"
                >
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
                  Task yarat
                </CreateTaskModal>
              </div>
            </div>
          )}

          {isFiltered && tasks.length === 0 && (
            <div className="mt-[36px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-30"></div>

              <Search className="w-16 h-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Axtardığınız task tapılmadı
              </h3>
              <p className="text-blue-600 mb-6 max-w-md">
                Heç bir nəticə tapılmadı. Filterləri sıfırlayaraq bütün mövcud
                taskları görə bilərsiniz.
              </p>

              <button
                onClick={() => {
                  setSearchQuery("");
                  updateURLParam("search", "");
                  fetchTasks();
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

export default Tasks;
