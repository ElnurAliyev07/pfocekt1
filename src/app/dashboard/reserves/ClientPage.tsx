'use client'

import React, { useMemo, useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Image as ImageIcon,
  Video,
  Camera,
} from "lucide-react";
import Image from 'next/image';
import usePlanningPostStore from "@/store/planningPostStore";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import useProjectStore from "@/store/projectStore";
import Pagination from "@/components/ui/pagination/Pagination";
import { getURLParam } from "@/utils/urlUtils";
import usePlanningStore from "@/store/planningStore";
import ViewReservePost from "@/app/dashboard/workspaces/[slug]/components/modals/ViewReservePost";
import { PlanningPost } from "@/types/planning.type";

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string; dot: string }
> = {
  published: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Dərc edilib",
    dot: "bg-green-500",
  },
  scheduled: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Planlaşdırılıb",
    dot: "bg-blue-500",
  },
  todo: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Layihə",
    dot: "bg-yellow-500",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Ləğv edilib",
    dot: "bg-red-500",
  },
  failed: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Xəta baş verdi",
    dot: "bg-red-500",
  },
};

const PlatformLogos: Record<string, React.FC> = {
  instagram: () => <FaInstagram />,
  facebook: () => <FaFacebook />,
  linkedin: () => <FaLinkedin />,
  youtube: () => <FaYoutube />,
  tiktok: () => <FaTiktok />,
  pinterest: () => <FaPinterest />,
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

const ReservesPage: React.FC = () => {
  const {
    planningPosts,
    fetchPlanningPosts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    sortConfig,
    setSortConfig,
    isLoading,
    totalPages,
    page,
    setPage,
    changePage,
    changeSearchQuery,
    setIsLoading,
    pageSize
  } = usePlanningPostStore();

  const { setWorkspace, } = useProjectStore();
  const { setSelectedPlanning } = usePlanningStore();
  const [selectedPost, setSelectedPost] = useState<PlanningPost | null>(null);

  useEffect(() => {
    setSelectedPlanning(null);
    setWorkspace(null);
  },[])

  useEffect(() => {
    const page = getURLParam("page");
    const search = getURLParam("search");
    if (page) setPage(Number(page));
    if (search) setSearchQuery(search);
    
    fetchPlanningPosts();
  }, [fetchPlanningPosts]);

  

  const handleSort = (field: "date" | "content" | "status") => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === field &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: field, direction });
  };

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...planningPosts];

    if (statusFilter !== "All") {
      filtered = filtered.filter((post) => post.status.key === statusFilter);
    }

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.date);
        return (
          postDate >= dateRange.startDate! && postDate <= dateRange.endDate!
        );
      });
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue =
          sortConfig.key === "status" ? a.status.key : a[sortConfig.key];
        const bValue =
          sortConfig.key === "status" ? b.status.key : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [planningPosts, searchQuery, statusFilter, dateRange, sortConfig]);

  return (
    <div className="min-h-screen mt-6">
      <div className=" rounded-lg ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rezervlər</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Axtarış..."
              className="pl-10 pr-4 py-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) =>  changeSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-4 py-3 w-full border rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Bütün statuslar</option>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              onChange={(e) =>
                setDateRange({
                  startDate: e.target.value ? new Date(e.target.value) : null,
                  endDate: dateRange.endDate,
                })
              }
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              onChange={(e) =>
                setDateRange({
                  startDate: dateRange.startDate,
                  endDate: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <InitializerWrapper isLoading={isLoading}>
              <table className="min-w-full divide-y divide-gray-200 border-collapse table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("content")}
                    >
                      Növü{" "}
                      {sortConfig?.key === "content" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Planlama
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tarix
                    </th>
                   
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Media
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Plt-lar
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortConfig?.key === "status" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Əməl.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedPosts.length > 0 ? (
                    filteredAndSortedPosts.map((post, index) => {
                      return (
                        <tr
                          key={post.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-2 py-2 whitespace-nowrap">
                            {(page - 1) * pageSize + index + 1}
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">
                                {post.type.title}
                              </span>
                              {post.content && (
                                <span
                                  className="text-xs text-gray-500 block"
                                  title={post.content}
                                >
                                  {truncateText(post.content, 25)}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                            {post.planning?.project?.title}
                          </td>
                          <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              {new Date(post.date).toLocaleDateString("tr-TR")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.date).toLocaleTimeString("tr-TR")}
                            </div>
                          </td>
                         
                          <td className="py-2 whitespace-nowrap">
                            <div className="flex items-center -space-x-4">
                              <Image
                                src="https://images.unsplash.com/photo-1754152728457-902f155ebcae?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Media 1"
                                width={52}
                                height={52}
                                className="w-12 h-12 object-cover rounded-full border-2 border-white"
                              />
                              <Image
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                                alt="Media 2"
                                width={52}
                                height={52}
                                className="w-12 h-12 object-cover rounded-full border-2 border-white"
                              />
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                                <span className="text-xs font-semibold text-gray-600">+2</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              {post.platform_intents?.length > 0 ? [
                                ...new Set(
                                  post.platform_intents?.map(
                                    (intent) => intent.platform
                                  )
                                ),
                              ].map((platform, i) => {
                                const LogoComponent = PlatformLogos[platform];
                                return LogoComponent ? (
                                  <div
                                    key={i}
                                    className={`transition-colors duration-200 text-gray-500`}
                                    title={platform}
                                  >
                                    <LogoComponent />
                                  </div>
                                ) : (
                                  <span
                                    key={i}
                                    className="text-xs text-gray-500"
                                  >
                                    {platform}
                                  </span>
                                );
                              }) : (
                                <span className="text-xs text-gray-500 text-center">—</span>
                              ) }
                            </div>
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusConfig[post.status.key]?.bg
                              } ${statusConfig[post.status.key]?.text}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-1.5 ${
                                  statusConfig[post.status.key]?.dot
                                }`}
                              ></span>
                              {post.status.label}
                            </span>
                          </td>
                          <td className="py-2 whitespace-nowrap text-sm font-medium">
                            {
                              post.is_reserved ? (
                                <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center"
                              onClick={() => {
                                if (post.planning) {
                                  setSelectedPost(post);
                                } else {
                                  alert('Bu post üçün planlama məlumatları tapılmadı');
                                }
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Bax
                            </button>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  —
                                </span>
                              )
                            }
                            </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        className="py-2 text-center text-gray-500"
                        colSpan={9}
                      >
                        <div className="flex flex-col items-center py-8">
                          <Search className="w-8 h-8 text-gray-300 mb-2" />
                          <p className="text-lg font-medium mb-1">
                            Nəticə tapılmadı
                          </p>
                          <p className="text-sm">
                            Axtarış meyarlarınızı dəyişməyi sınayın
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>{" "}
            </InitializerWrapper>
            {totalPages > 1 && !isLoading && (
              <div className="flex justify-end mt-[48px]">
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={(e) => {
                    setIsLoading(true);
                    changePage(e);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ViewReservePost Modal */}
      {selectedPost && selectedPost.planning && (
        <ViewReservePost 
          planning={selectedPost.planning} 
          post={selectedPost}
          isOpen={true}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ReservesPage;
