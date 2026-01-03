import { Planning, PlanningPost } from '@/types/planning.type'
import { formatDate } from '@/utils/formateDateTime'
import React, { useState } from 'react'
import Menu from '@/components/ui/icons/Menu'
import PlanningAssignerListModal from '../modals/PlanningAssignerList'
import { Button } from "@/components/ui"
import DeletePlanningPostModal from '../modals/DeletePlanningPost'
import ReservePostsModal from '../modals/EditReservePost'
import Link from 'next/link'
import CreateReservePostModal from '../modals/CreateReservePost'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown/Dropdown'

interface Props {
  post: PlanningPost,
  planning: Planning
}

const PlanningPostItem: React.FC<Props> = ({ post, planning }) => {
  const [selectedModal, setSelectedModal] = useState<string | number | null>(null);

    const openModal = (key: string | number) => {
        setSelectedModal(key);
      };
    
      const closeModal = () => {
        setSelectedModal(null);
      };
  return (
    <div className="grid border-t border-b border-[#E8EAED] grid-cols-8 place-items-center gap-4 text-[14px] text-center  text-t-black py-3">
      <div className="px-1 md:px-4">{post.type.title}</div>
      <div className="px-1 md:px-4">{formatDate(post.date)}</div>
      <div className="px-1 md:px-4">{post.content == ''  ? 'Məlumat yoxdur': post.content}</div>
      <div className="px-1 md:px-4 flex items-center justify-center gap-[4px]">
        <span>{post.planning_post_assigners.length}</span>
        {post.planning_post_assigners.length > 0 && 
          <PlanningAssignerListModal planningPost={post} />
        }
      </div>
      <div className='px-1 md:px-4'>  
        {
          post.task ? (
            <Link 
              className='inline-flex whitespace-nowrap  items-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:text-primary-darker transition-colors rounded hover:bg-primary/5' 
              href={`/dashboard/tasks/${post.task}/`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Taska bax
            </Link>
          ) : (
            <Link 
              className='inline-flex  whitespace-nowrap items-center gap-1 px-2 py-2 text-xs font-medium text-red-500 hover:text-red-600 transition-colors rounded bg-red-50 hover:bg-red-100' 
              href={`/dashboard/projects/${planning.project.slug}/?isOpen=true`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Task əlavə et
            </Link>
          )
        }
      </div>

      <div className="px-1 md:px-4">{post.status.label}</div>
      <div className="px-1 md:px-4 flex items-center justify-center">
        {/* <Preview /> */}
        {
           ["scheduled", "published", "failed"].includes(post.status.key) ? (
            <ReservePostsModal planning={planning} post={post}/>
          ):(
            <CreateReservePostModal planning={planning} post={post}/>
          )
        }
      </div>
      <div className="px-1 md:px-4">
        <Dropdown>
          <DropdownTrigger nested>
              <Menu className="text-gray-500" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => openModal("delete")} className="text-red-500">
              Sil
            </DropdownItem>
          </DropdownMenu>
          
        </Dropdown>
      </div>
      <DeletePlanningPostModal post_id={post.id} isOpen={selectedModal === "delete"} onClose={closeModal} />

    </div>
  )
}

export default PlanningPostItem