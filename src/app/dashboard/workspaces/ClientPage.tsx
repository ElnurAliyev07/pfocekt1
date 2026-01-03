"use client";

import { WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";
import FilterSection from "./components/containers/FilterSection";
import WorkspaceList from "./components/containers/WorkspaceList";
import { useEffect, useState } from "react";
import { getURLParam } from "@/utils/urlUtils";
import useWorkspaceStore from "@/store/workspaceStore";
import { getWorkspaceCategorieService, getWorkspaceStatusService } from "@/services/server/workspace.service";


interface Props {

}

const ClientPage: React.FC<Props> = ({
}) => {
  
  const {
    setSearchQuery,
    setPage,
    setCategory,
    fetchWorkspaces,
    resetStore
  } = useWorkspaceStore();
  
  const [workspaceCategories, setWorkspaceCategories] = useState<WorkspaceCategory[]>([]);
  const [workspaceStatusList, setWorkspaceStatusList] = useState<WorkspaceStatus[]>([]);
  useEffect(() => {
    resetStore();
  }, []);
  
  useEffect(() => {
    const search = getURLParam("search");
    const page = getURLParam("page");
    const category = getURLParam("category");
    setSearchQuery(search || "");
    setPage(Number(page) || 1);
    if (category) {
      setCategory(Number(category));
    }
    const loadWorkspaces = async () => {
      await fetchWorkspaces(false);
    };
    loadWorkspaces();
  }, [
    setSearchQuery,
    fetchWorkspaces,
    setPage,
    setCategory
  ]);

  useEffect(() => {
    const loadWorkspaceCategories = async () => {
      const response = await getWorkspaceCategorieService();
      setWorkspaceCategories(response.data);
    };
    loadWorkspaceCategories();
  }, []);

  useEffect(() => {
    const loadWorkspaceStatusList = async () => {
      const response = await getWorkspaceStatusService();
      setWorkspaceStatusList(response.data);
    };
    loadWorkspaceStatusList();
  }, []);
  return (
    <>
      <FilterSection
        workspaceStatusList={workspaceStatusList}
        workspaceCategories={workspaceCategories}
      />
      <WorkspaceList
        workspaceStatusList={workspaceStatusList}
        workspaceCategories={workspaceCategories}
      />
    </>
  );
};

export default ClientPage;
