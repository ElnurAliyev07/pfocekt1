import PlanningAssignerListModal from '@/app/dashboard/workspaces/[slug]/components/modals/PlanningAssignerList'
import { PlanningPost } from '@/types/planning.type'
import { formatDate } from '@/utils/formateDateTime'
import Button from '@/components/ui/Button'
import React from 'react'

interface Props {
  post: PlanningPost
  onSelect: (selectedPost: PlanningPost) => void
}

const PlanningPostItem: React.FC<Props> = ({ post, onSelect }) => {
  return (
    <div className="grid place-items-center border-t border-b border-[#E8EAED] grid-cols-6 gap-4 text-[14px] text-center text-t-black py-3">
      <div className="px-4">{post.type.title}</div>
      <div className="px-4">{formatDate(post.date)}</div>
      <div className="px-4">{post.content}</div>
      <div className="px-4 flex items-center justify-center gap-[4px]">
        <span>{post.planning_post_assigners.length}</span>
        <PlanningAssignerListModal planningPost={post} />
      </div>
      <div className="px-4">{post.status.label}</div>
      <div className="px-4">
        <Button
          variant="ghost"
          className="text-primary"
          onPress={() => onSelect(post)} // onSelect fonksiyonunu çağır
        >
          Seç
        </Button>
      </div>
    </div>
  )
}

export default PlanningPostItem