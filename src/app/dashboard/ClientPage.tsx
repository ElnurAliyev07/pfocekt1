"use client";

import React, { useEffect, useState } from "react";
import {
  TaskBlue,
  TaskGreen,
  TaskOrange,
  TaskPink,
  TaskPurple,
  TaskYellow,
} from "./components/svgs/SvgS";
import StatsCard from "./components/common/StatsCard";
import RecentActivity from "./components/common/RecentActivity";
import TaskList from "./components/common/TaskList";
import UserTaskList from "./components/common/UserTaskList";
import { DashboardStatistic } from "@/types/dashboard.type";
import useWorkspaceStore from "@/store/workspaceStore";
import { WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";
import WorkspaceList from "./components/common/WorkspaceList";
import { getURLParam } from "@/utils/urlUtils";
import Link from "next/link";
import SectionWrapper from "@/components/common/wrappers/SectionWrapper";
import useGeneralStore from "@/store/generalStore";
import { getWorkspaceCategorieService, getWorkspaceStatusService } from "@/services/server/workspace.service";

interface Props {
  statistic: DashboardStatistic;

}

const ClientPage: React.FC<Props> = ({
  statistic,

}) => {
  const { fetchWorkspaces, setIsLoading, setIsCreator, resetStore } = useWorkspaceStore();

  const { fetchMemberShipStatuses } = useGeneralStore();

  const [workspaceCategories, setWorkspaceCategories] = useState<WorkspaceCategory[]>([]);
  const [workspaceStatusList, setWorkspaceStatusList] = useState<WorkspaceStatus[]>([]);
  useEffect(() => {
    resetStore();
  }, []);

  useEffect(() => {
    const isCreator = getURLParam("is_creator");
    setIsCreator(isCreator === "true");
  }, [setIsCreator]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      setIsLoading(true);
      await fetchWorkspaces(true, 5);
      setIsLoading(false);
    };

    loadWorkspaces();
  }, [fetchWorkspaces, setIsLoading]);

  useEffect(() => {
    const loadMemberShipStatuses = async () => {
        await fetchMemberShipStatuses();
    };
    loadMemberShipStatuses();
  }, [fetchMemberShipStatuses]);

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
    <div className="flex flex-col w-full lg:px-0">
      {/* Stats Section - Desktop View */}
      <section className="hidden lg:block py-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Stats Cards Grid */}
          <div className="col-span-3 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#CDF7FD"
                icon={<TaskBlue />}
                title="Ümumi Task Sayı"
                value={statistic.total_subtask_count}
                color="#31E4FF"
              />
            </div>

            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#FFFBE5"
                icon={<TaskYellow />}
                title="Başlanmamış tasklar"
                value={statistic.not_started_subtask_count}
                color="#FFD800"
              />
            </div>

            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#F2EFFF"
                icon={<TaskPurple />}
                title="Davam edən Tasklar"
                value={statistic.in_progress_subtask_count}
                color="#563BFF"
              />
            </div>

            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#F1FFEC"
                icon={<TaskGreen />}
                title="Bitmiş tasklar"
                value={statistic.finished_subtask_count}
                color="#21A931"
              />
            </div>

            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#FFF5E9"
                icon={<TaskOrange />}
                title="Qazanılan məbləğ"
                value="0"
                tail="AZN"
                color="#F5AB20"
              />
            </div>

            <div className="transition-all duration-200 hover:translate-y-[-4px]">
              <StatsCard
                cardColor="#FCE8FB"
                icon={<TaskPink />}
                title="İşə qatdığı dəyər"
                value="100"
                tail="%"
                color="#FB12F2"
              />
            </div>
          </div>

          {/* Workspace List - Desktop */}
          <div className="col-span-3 lg:col-span-1">
            <WorkspaceList
              className="md:h-[390px]  shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl"
              workspaceCategories={workspaceCategories}
              workspaceStatusList={workspaceStatusList}
            />
          </div>
        </div>
      </section>

      {/* Workspaces Section - Mobile (Most Important) */}
      <section className="lg:hidden mt-3 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">
            Virtual Ofislər
          </h3>
          <Link
            href="/dashboard/workspaces/"
            className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/5 active:bg-primary/10 transition-colors"
          >
            Hamısı
          </Link>
        </div>
        <WorkspaceList
          className="shadow-sm bg-white rounded-xl overflow-hidden"
          workspaceCategories={workspaceCategories}
          workspaceStatusList={workspaceStatusList}
        />
      </section>

      {/* Tasks & Activities Section for Mobile */}
      <section className="mt-2 lg:mt-8 ">
        {/* Daily Tasks Section - Mobile */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Günlük Tasklar
            </h3>
            <Link
              href="/dashboard/tasks/daily"
              className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/5 active:bg-primary/10 transition-colors"
            >
              Hamısı
            </Link>
          </div>
          <TaskList
            title="Bu gün"
            date="04 Sent 2024, Şənbə"
            className="shadow-sm bg-white rounded-xl overflow-hidden"
          />
        </div>

        {/* My Tasks Section - Mobile */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Mənim Tasklarım
            </h3>
            <Link
              href="/dashboard/tasks/my-tasks"
              className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/5 active:bg-primary/10 transition-colors"
            >
              Hamısı
            </Link>
          </div>
          <TaskList
            title="Öncəlik Təşkil Edən"
            date="Öncəlik: Yüksək"
            className="shadow-sm bg-white rounded-xl overflow-hidden"
          />
        </div>

        {/* Recent Activity - Mobile */}
        <div className="lg:hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Son Aktivitə</h3>
            <Link
              href="/dashboard/activity"
              className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/5 active:bg-primary/10 transition-colors"
            >
              Hamısı
            </Link>
          </div>
          <RecentActivity />
        </div>

        {/* Tasks and Activities - Desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SectionWrapper disabled={true}>
            <TaskList title="Günlük Tasklarım" date="04 Sent 2024, Şənbə" />
          </SectionWrapper>
          <SectionWrapper disabled={true}>
            <TaskList title="Mənim Tasklarım" date="04 Sent 2024, Şənbə" />
          </SectionWrapper>
          <SectionWrapper disabled={true}>
            <RecentActivity />
          </SectionWrapper>
        </div>
      </section>

      {/* User Task List Section */}
      <SectionWrapper
        disabled={true}
        // message="Yükleniyor..."
        // showSpinner={true}
        // spinnerSize="lg"
        // blurBackground={true}
        // overlayOpacity={10}
        containerClassName="lg:mt-10 mb-6 "
        // messageClassName="text-blue-600 font-bold"
        // onOverlayClick={() => console.log('Overlay clicked')}
      >
        <div className="lg:hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Komanda İşləri
            </h3>
            <Link
              href="/dashboard/team-tasks"
              className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/5 active:bg-primary/10 transition-colors"
            >
              Hamısı
            </Link>
          </div>
          <div className="px-0 mb-0">
            <UserTaskList />
          </div>
        </div>

        <div className="hidden lg:block px-0 mb-0">
          <UserTaskList />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ClientPage;
