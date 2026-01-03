"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "../inputs/Search";
import useWorkspaceStore from "@/store/workspaceStore";
import { removeURLParam, updateURLParam } from "@/utils/urlUtils";
import CreateWorkspaceModal from "../modals/CreateWorkspace";
import { WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";
import Select, { SelectItem } from "@/components/ui/form/Select";
import { useSearchParams } from "next/navigation";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { debounce } from "@/utils/debounceUtils";

interface Props {
  workspaceCategories: WorkspaceCategory[];
  workspaceStatusList: WorkspaceStatus[];
}

const FilterSection: React.FC<Props> = ({
  workspaceCategories,
  workspaceStatusList,
}) => {
  const {
    searchQuery,
    setIsLoading,
    setSearchQuery,
    fetchWorkspaces,
    setCategory,
    isFiltered,
    workspaces,
    page,
    setPage
  } = useWorkspaceStore();

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const handleSearch = debounce(async (query: string) => {
    updateURLParam("search", query);
    if(page > 1){
      updateURLParam("page", String(1));
    }
    setSearchQuery(query);
    await fetchWorkspaces(true);
  }, 300);

  const handleCategorySelect = async (query: string) => {
    // Önce kategori değerini güncelleyelim
    if (query.length > 0) {
      setCategory(Number(query));
      updateURLParam("category", String(query));
    } else {
      setCategory(undefined);
      removeURLParam("category");
    }
    updateURLParam("page", String(1));

    // Kategori değişikliğinin store'a yansıması için bir mikrosaniye bekleyelim
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Şimdi fetch işlemini yapalım
    await fetchWorkspaces(true);
  };
  if (isFiltered || workspaces.length > 0) {
    return (
      <div>
        <div className="mt-[24px] md:mt-[36px] flex flex-col flex-wrap gap-[20px] lg:flex-row lg:justify-between">
          <div className="flex flex-col lg:flex-row gap-[16px]">
            <SearchInput
              defaultValue={searchQuery} // searchQuery'yi buraya bağladık
              onSearch={handleSearch}
              placeholder="Axtar..."
            />

            <div className="flex flex-row gap-[20px] md:gap-[12px]">
              {/* <InitializerWrapper loadingComponent={<Skeleton className="h-[44px] w-[170px]" />}>
              <Select
                placeholder="Kateqoriya seçin"
                className="h-[44px] bg-white"
                value={category ? String(category) : ""}
                onValueChange={(value) => handleCategorySelect(value as string)}
                resetable={true}
              >
                {workspaceCategories.map((category) => (
                  <SelectItem
                    className="whitespace-nowrap"
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </InitializerWrapper> */}
            </div>
          </div>
          <div>
            <CreateWorkspaceModal
              workspaceCategories={workspaceCategories}
              workspaceStatusList={workspaceStatusList}
            />
          </div>
        </div>
      </div>
    );
  }
};
export default FilterSection;
