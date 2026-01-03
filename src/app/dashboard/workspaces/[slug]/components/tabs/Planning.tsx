import React, { useEffect, useState } from "react";
import usePlanningStore from "@/store/planningStore";
import { useDisclosure } from "@/components/ui/modal";
import { Planning as PlanningType } from "@/types/planning.type";
import { HiLink, HiDocumentText } from "react-icons/hi";
import { getURLParam, updateURLParam } from "@/utils/urlUtils";

// Import components
import PlanningHeaderComponent from "../sections/planning/PlanningHeader";
import PlanningTabs from "../sections/planning/PlanningTabs";
import SocialMediaSectionProps from "../sections/planning/SocialMediaSection";
import PostsTable from "../sections/planning/PostsTable";
import EmptyState from "../sections/planning/EmptyState";
import PlatformLinkModal from "../sections/planning/PlatformLinkModal";
import DeletePlanning from "../modals/DeletePlanning";
import EditPlanningMultiple from "../modals/EditPlanningMultiple";
import useProjectStore from "@/store/projectStore";
import { useAppContext } from "@/providers/AppProvider";
import usePlanningPostStore from "@/store/planningPostStore";

// Loading Components
const PlanningTabsSkeleton = () => (
  <div className="animate-pulse mt-5">
    <div className="flex gap-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const PlanningContentSkeleton = () => (
  <div className="animate-pulse mt-5">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// Action Buttons Component
const PlanningActions = ({ planning }: { planning: PlanningType }) => (
  <div className="flex items-center gap-2">
    <DeletePlanning
      planning={planning}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
    />
    <EditPlanningMultiple
      planning={planning}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
    />
  </div>
);

// Content Tabs Component
const ContentTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "social_medias" | "posts";
  onTabChange: (tab: "social_medias" | "posts") => void;
}) => (
  <div className="flex gap-1.5 p-1 bg-gray-50/50 rounded-xl">
    <button
      onClick={() => onTabChange("posts")}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
        activeTab === "posts"
          ? "bg-white text-primary shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
      }`}
    >
      <HiDocumentText className="w-4 h-4" />
      <span className="font-medium">Postlar</span>
    </button>
    <button
      onClick={() => onTabChange("social_medias")}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
        activeTab === "social_medias"
          ? "bg-white text-primary shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
      }`}
    >
      <HiLink className="w-4 h-4" />
      <span className="font-medium">Sosial Media Hesabları</span>
    </button>
  </div>
);

// Planning Header Component
const PlanningHeader = ({ planning }: { planning: PlanningType }) => {
  const { planningPosts } = usePlanningPostStore();
  return (
    <div className="bg-white rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            {planning.project.title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <HiDocumentText className="w-4 h-4" />
              <span>{planningPosts.length || 0} post</span>
            </div>
            <div className="flex items-center gap-1">
              <HiLink className="w-4 h-4" />
              <span>{planning.social_accounts?.length || 0} sosial media</span>
            </div>
          </div>
        </div>
        {/* <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-800">
          {planning.project.tasks_count} task
        </span> */}
      </div>
    </div>
  );
};

// Main Component
const Planning = () => {
  const {
    plannings,
    selectedPlanning,
    setSelectedPlanning,
    isLoading,
    fetchPlannings,
    fetchPlanningPostStatuses,
    fetchPlanningPostTypes,
    setIsLoading,
  } = usePlanningStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPlatform, setCurrentPlatform] = useState<any>(null);
  const [activeContentTab, setActiveContentTab] = useState<
    "social_medias" | "posts"
  >("posts");

  const { fetchPlanningPosts, setPage } = usePlanningPostStore();

  const { workspaceSlug, fetchProjects } = useProjectStore();

  const { fetchProfessions, fetchPlatforms } = useAppContext();
  // Handle URL parameters on client side
  useEffect(() => {
    const savedTab = getURLParam("contentTab") as "social_medias" | "posts";
    if (savedTab) {
      setActiveContentTab(savedTab);
    }
  }, []);

 

  useEffect(() => {
    if (!workspaceSlug) return;
    const loadData = async () => {
      await Promise.all([
        fetchPlannings(),
        fetchProfessions(),
        fetchPlatforms(),
        fetchPlanningPostStatuses(),
        fetchPlanningPostTypes(),
        fetchProjects(true),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [workspaceSlug]);

  useEffect(() => {
    updateURLParam("contentTab", activeContentTab);
  }, [activeContentTab]);

  // Handle initial planning selection from URL or default to first
  useEffect(() => {
    if (plannings.length === 0) return;
    
    // If no planning is selected, try to restore from URL or select first
    if (!selectedPlanning) {
      const savedPlanningId = getURLParam("planning");
      let planningToSelect = null;
      
      if (savedPlanningId) {
        planningToSelect = plannings.find(p => p.id === parseInt(savedPlanningId));
      }
      
      // If no valid planning found in URL, select the first one
      if (!planningToSelect) {
        planningToSelect = plannings[0];
      }
      
      setSelectedPlanning(planningToSelect);
    }
  }, [plannings]); // Only depend on plannings array
  
  // Handle URL updates when planning changes
  useEffect(() => {
    if (selectedPlanning) {
      updateURLParam("planning", selectedPlanning.id.toString());
      setPage(Number(getURLParam('page') || '1'));
    }
  }, [selectedPlanning]); // Only depend on selectedPlanning

  useEffect(() => {
    if (!selectedPlanning) return;
    const loadPlanningPosts = async () => {
      await fetchPlanningPosts();
    };
    loadPlanningPosts();
  }, [selectedPlanning]);

  const handlePlatformClick = (platform: any) => {
    setCurrentPlatform(platform);
    onOpen();
  };

  const renderContent = () => {
    if (!selectedPlanning || plannings.length === 0) {
      return <EmptyState type="planning" />;
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 space-y-6">
          <PlanningHeader planning={selectedPlanning} />

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <ContentTabs
              activeTab={activeContentTab}
              onTabChange={(e) => {
                setActiveContentTab(e);
                updateURLParam("contentTab", e);
              }}
            />
            <PlanningActions planning={selectedPlanning} />
          </div>

          <div className="pt-2">
            {activeContentTab === "social_medias" ? (
              <SocialMediaSectionProps
                planning={selectedPlanning}
                onPlatformClick={handlePlatformClick}
              />
            ) : (
              <PostsTable planning={selectedPlanning} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <PlanningHeaderComponent
        onSearch={(query: string) => console.log(query)}
      />

      {isLoading ? (
        <PlanningTabsSkeleton />
      ) : (
        <PlanningTabs
          plannings={plannings}

        />
      )}

      {isLoading ? <PlanningContentSkeleton /> : renderContent()}

      <PlatformLinkModal
        isOpen={isOpen}
        onClose={onClose}
        platform={currentPlatform}
        planning={selectedPlanning}
      />
    </div>
  );
};

export default Planning;
