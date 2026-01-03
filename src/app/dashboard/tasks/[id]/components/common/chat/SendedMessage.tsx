import { TaskMessage } from '@/types/chat.type'
import { isOnlyEmojis } from '@/utils/emojIUtils'
import { formatTime } from '@/utils/formateDateTime'
import Image from 'next/image'
import React from 'react'

interface Props {
  message: TaskMessage
  showUserInfo: boolean
}

const SendedMessage: React.FC<Props> = ({ message, showUserInfo }) => {
  return (
    <div className="flex justify-end gap-[12px]">
      <div className="flex flex-col items-end">
        {/* Message Bubble */}
        <div className={`h-[36px] rounded-[12px] flex items-center leading-[20px] text-white ${isOnlyEmojis(message.message) ? 'text-[30px]' : 'bg-primary text-[14px] px-[16px]'}`}>
          {message.message}
        </div>
        <div className='mt-[10px] text-[#64717C] text-[12px]'>
          {formatTime(message.created_at)}
        </div>
      </div>
      {showUserInfo ? (
        <Image
          src={message.user.user_profile.image || "/grid.png"}
          width={100}
          height={100}
          alt="user"
          className="w-[40px] h-[40px] rounded-full object-cover object-center"
        />
        ): <div className='w-[40px]'></div>}

      
    </div>
  )
}

export default SendedMessage
