'use client';

import React, { useMemo } from 'react';
import WorkspaceItem from '../workspace/WorkspaceItem';
import SkeletonWorkspaceItem from '../workspace/SkeletonWorkspace';
import useWorkspaceStore from '@/store/workspaceStore';
import {  clearURLParams, updateURLParam,  } from '@/utils/urlUtils';
import { Workspace, WorkspaceCategory, WorkspaceStatus } from '@/types/workspace.type';
import Pagination from '@/components/ui/pagination/Pagination';
import CreateWorkspaceModal from '../modals/CreateWorkspace';
import Search from '@/components/ui/icons/Search';
import { BiRefresh } from 'react-icons/bi';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';


interface Props {
  workspaceCategories: WorkspaceCategory [],
  workspaceStatusList: WorkspaceStatus []
}

const WorkspaceList: React.FC<Props> = ({workspaceCategories, workspaceStatusList}) => {
  const { isLoading, totalPages, page, isFiltered, resetStore,  setPage, setIsLoading, fetchWorkspaces, workspaces } = useWorkspaceStore();

  const {user} = useAuth();  
  // Filter workspaces by creator status
  const myWorkspaces = useMemo(() => 
    workspaces.filter(workspace => Number(workspace.creator) === Number(user?.id)),
    [workspaces]
  );

  const memberWorkspaces = useMemo(() => 
    workspaces.filter(workspace => Number(workspace.creator) !== Number(user?.id)),
    [workspaces]
  );
  

  // Memoized skeleton items for consistent rendering
  const skeletonItems = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => <SkeletonWorkspaceItem key={index} />),
    []
  );

  // Create workspace item components
  const renderWorkspaceItems = (workspaceList: Workspace[]) => {
    return workspaceList.map((workspace, index) => (
      <WorkspaceItem 
        index={index} 
        workspaceCategories={workspaceCategories} 
        workspaceStatusList={workspaceStatusList} 
        key={workspace.id} 
        workspace={workspace} 
      />
    ));
  };
  
  return (
    <div className="mt-[36px]">
      {/* My Workspaces Section */}
      {myWorkspaces.length > 0 && (
        <div className="mb-[48px]">
          <h2 className="text-[18px] md:text-[22px] font-medium text-t-black mb-[24px]">
            Mənim virtual ofislərim
          </h2>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-[24px] gap-[20px]">
            {isLoading ? skeletonItems : renderWorkspaceItems(myWorkspaces)}
          </div>
        </div>
      )}

      {/* Member Workspaces Section */}
      {memberWorkspaces.length > 0 && (
        <div>
          <h2 className="text-[18px] md:text-[22px] font-medium text-t-black mb-[24px]">
            Üzv olduğum virtual ofislərim
          </h2>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-[24px] gap-[20px]">
            {isLoading ? skeletonItems : renderWorkspaceItems(memberWorkspaces)}
          </div>
        </div>
      )}

      {/* Show loading skeleton when there are no workspaces and still loading */}
      {isLoading && myWorkspaces.length === 0 && memberWorkspaces.length === 0 && (
        <div className="mt-[36px] md:mt-[48px] flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-[24px] gap-[20px]">
          {skeletonItems}
        </div>
      )}

      {/* Empty state when there are no workspaces - beginner friendly */}
      {!isLoading && !isFiltered && myWorkspaces.length === 0 && memberWorkspaces.length === 0 && (
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
                alt="Virtual ofis" 
                className="w-full h-full object-contain"
              
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 text-left relative z-10">
            <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-3">
              Xoş gəlmisiniz!👋
            </div>
            
            <h3 className="text-[22px] font-semibold text-t-black mb-4">
              Komandanızla işləməyə başlayın
            </h3>
            
            <div className="space-y-4 mb-6 max-w-lg">
              <p className="text-[15px] text-slate-600">
                <strong>Virtual ofis nədir?</strong> Komandanızla birlikdə işləmək üçün məkan - burada tapşırıqlar yarada, layihələr idarə edə və əməkdaşlıq edə bilərsiniz.
              </p>
              
              <ul className="space-y-2">
                {[
                  "Komanda üzvləri əlavə edin",
                  "Layihələr və tapşırıqlar yaradın",
                  "İş axınlarını idarə edin"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[14px] text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CreateWorkspaceModal
              workspaceCategories={workspaceCategories}
              workspaceStatusList={workspaceStatusList}
              containerClassName="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow"

            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              İlk virtual ofisinizi yaradın
            </CreateWorkspaceModal>
          </div>
        </div>
      )}

      {!isLoading && isFiltered && myWorkspaces.length === 0 && memberWorkspaces.length === 0 && (
        <div className="mt-[36px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-30"></div>
          
          <Search className="w-16 h-16 text-blue-300 mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Axtardığınız workspace tapılmadı</h3>
          <p className="text-blue-600 mb-6 max-w-md">Heç bir nəticə tapılmadı. Filterləri sıfırlayaraq bütün mövcud workspaceləri görə bilərsiniz.</p>
          
          <button 
            onClick={() => {
              resetStore();
              clearURLParams();
              fetchWorkspaces(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all flex items-center gap-2"
          >
            <BiRefresh className="w-4 h-4" /> 
            Filterləri Sıfırla
          </button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-end mt-[48px]'>
          <Pagination 
            totalPages={totalPages} 
            currentPage={page} 
            onPageChange={(e) => { 
              setIsLoading(true);
              setPage(e);
              updateURLParam("page",String(e));
              fetchWorkspaces(); 
              setIsLoading(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
