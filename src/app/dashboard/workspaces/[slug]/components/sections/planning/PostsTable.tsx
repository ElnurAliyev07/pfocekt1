import React, { useEffect } from "react";
import { Planning as PlanningType } from "@/types/planning.type";
import PlanningPostItem from "../../common/PlanningPostItem";
import EmptyState from "./EmptyState";
import usePlanningPostStore from "@/store/planningPostStore";
import { getURLParam } from "@/utils/urlUtils";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import Pagination from "@/components/ui/pagination/Pagination";

interface PostsTableProps {
  planning: PlanningType;
}

const PostsTable: React.FC<PostsTableProps> = ({ planning }) => {
  const { planningPosts } = usePlanningPostStore();
  const {
    isLoading,
    totalPages,
    page,
    changePage,
    setIsLoading,
  } = usePlanningPostStore();


  return (
    <div className="max-w-full overflow-x-auto">
      <InitializerWrapper isLoading={isLoading}>
        {planningPosts.length > 0 ? (
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 gap-4 text-[16px] md:text-[16px] text-center font-semibold text-t-black py-2 bg-white  shadow-sm mb-2">
              <div className="whitespace-nowrap ">Post növü</div>
              <div className="whitespace-nowrap ">Paylaşılan tarix</div>
              <div className="whitespace-nowrap ">Qeyd</div>
              <div className="whitespace-nowrap ">Üzvlər</div>
              <div className="whitespace-nowrap ">Task</div>
              <div className="whitespace-nowrap ">Status</div>
              <div className="whitespace-nowrap ">Rezervlər</div>
              <div className="whitespace-nowrap "></div>
            </div>
            <div className="space-y-2 text-center">
              {planningPosts.map((post: any, index: number) => (
                <PlanningPostItem key={index} post={post} planning={planning} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState type="posts" planning={planning} />
        )}
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
  );
};

export default PostsTable;
