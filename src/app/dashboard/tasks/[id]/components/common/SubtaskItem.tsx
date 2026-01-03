import { SubTask, SubtaskStatus } from '@/types/subtask.type'
import { formatDate, formatTime } from '@/utils/formateDateTime'
import React, { useEffect, useState } from 'react'
import Check from '../icons/Check';
import Reject from '../icons/Reject';
import Edit from '../icons/Edit';
import Share from '../icons/Share';
import { acceptSubtaskService } from '@/services/client/subtask.service';
import { showToast, ToastType } from '@/utils/toastUtils';
import NotAcceptedModal from '../modals/SubtaskNotAccepted';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { HiCalendar, HiClock, HiFlag, HiUser, HiUserCircle } from 'react-icons/hi';
import Image from 'next/image';
import { getSubtaskByKey } from '@/types/task_helper.type';
import { useAppContext } from '@/providers/AppProvider';

const statusStyles: Record<string, { bgColor: string, textColor: string, circleColor: string, borderColor: string, lightBg: string, gradientFrom: string, gradientTo: string }> = {
    pending: { 
        bgColor: 'bg-[#FFF8E1]', 
        textColor: 'text-[#F59E0B]', 
        circleColor: 'bg-[#F59E0B]',
        borderColor: 'border-[#F59E0B]',
        lightBg: 'bg-[#F9F9F9]',
        gradientFrom: 'from-[#F59E0B]',
        gradientTo: 'to-[#D97706]'
    },
    must_be_done: { 
        bgColor: 'bg-[#FEE2E2]', 
        textColor: 'text-[#EF4444]', 
        circleColor: 'bg-[#EF4444]',
        borderColor: 'border-[#EF4444]',
        lightBg: 'bg-[#FEF2F2]',
        gradientFrom: 'from-[#EF4444]',
        gradientTo: 'to-[#DC2626]'
    },
    must_be_done_again: { 
        bgColor: 'bg-[#FEE2E2]', 
        textColor: 'text-[#EF4444]', 
        circleColor: 'bg-[#EF4444]',
        borderColor: 'border-[#EF4444]',
        lightBg: 'bg-[#FEF2F2]',
        gradientFrom: 'from-[#EF4444]',
        gradientTo: 'to-[#DC2626]'
    },
    in_progress: { 
        bgColor: 'bg-[#EFF6FF]', 
        textColor: 'text-[#3B82F6]', 
        circleColor: 'bg-[#3B82F6]',
        borderColor: 'border-[#3B82F6]',
        lightBg: 'bg-[#F5F9FF]',
        gradientFrom: 'from-[#3B82F6]',
        gradientTo: 'to-[#2563EB]'
    },
    completed: { 
        bgColor: 'bg-[#ECFDF5]', 
        textColor: 'text-[#10B981]', 
        circleColor: 'bg-[#10B981]',
        borderColor: 'border-[#10B981]',
        lightBg: 'bg-[#F5FEF9]',
        gradientFrom: 'from-[#10B981]',
        gradientTo: 'to-[#059669]'
    },
    rejected: { 
        bgColor: 'bg-[#F3F4F6]', 
        textColor: 'text-[#6B7280]', 
        circleColor: 'bg-[#6B7280]',
        borderColor: 'border-[#6B7280]',
        lightBg: 'bg-[#F9FAFB]',
        gradientFrom: 'from-[#6B7280]',
        gradientTo: 'to-[#4B5563]'
    },
    accepted: { 
        bgColor: 'bg-[#ECFDF5]', 
        textColor: 'text-[#10B981]', 
        circleColor: 'bg-[#10B981]',
        borderColor: 'border-[#10B981]',
        lightBg: 'bg-[#F5FEF9]',
        gradientFrom: 'from-[#10B981]',
        gradientTo: 'to-[#059669]'
    },
};

const SubtaskItem = ({ subtask, isLast, persentage, previous_subtask }: { subtask: SubTask, previous_subtask?: SubTask, isLast: boolean, persentage: number }) => {
    const [currentStatus, setCurrentStatus] = useState<SubtaskStatus>(subtask.subtask_status);
    const [isHovered, setIsHovered] = useState(false);

    const statusStyle = statusStyles[currentStatus.status] || statusStyles['pending'];

    const { setIsLoading } = useAppContext();

    useEffect(() => {
        setCurrentStatus(subtask.subtask_status);
    }, [subtask]);

    const handleAcceptTask = async () => {
        try {
            setIsLoading(true);
            await acceptSubtaskService(subtask.id);
            setCurrentStatus({ status: 'accepted', status_display: 'Qəbul edildi' });
            setIsLoading(false);
            showToast("Tapşırıq qəbul edildi", ToastType.SUCCESS);
        } catch (error) {
            console.log(error);
            showToast("Failed to start subtask!", ToastType.ERROR);
            setIsLoading(false);
        }
    }

    return (
        <>
            <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="text-t-black px-[4px] md:pr-[16px] font-medium text-[14px] min-w-[60px] text-center">
                    {formatTime(subtask.started_date)}
                </div>
                <div 
                    className={`
                        ${statusStyle.lightBg} 
                        flex justify-between gap-[16px] items-center px-[20px] py-[18px] flex-1 
                        rounded-[16px] border ${isHovered ? `${statusStyle.borderColor}` : 'border-[#E8EAED]'} 
                        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
                        backdrop-blur-sm bg-opacity-95
                        transition-all duration-300 ease-in-out
                        hover:translate-y-[-2px]
                    `}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="space-y-[12px] flex-grow">
                        {/* Mobil için durum göstergesi */}
                        <div className={`${statusStyle.bgColor} h-[28px] md:hidden flex items-center gap-[6px] px-[10px] py-[6px] rounded-full w-fit`}>
                            <div className={`h-[8px] w-[8px] rounded-full ${statusStyle.circleColor}`}></div>
                            <div className={`${statusStyle.textColor} text-[12px] leading-[16px] font-medium`}>
                                {currentStatus.status_display}
                            </div>
                        </div>
                        
                        {/* Alt görev başlığı ve durum */}
                        <div className='flex flex-wrap items-center gap-[12px] md:gap-[20px]'>
                            <div className="flex flex-col gap-1">
                                {(!subtask.subtask_types || subtask.subtask_types.length === 0) && (
                                    <Link 
                                        href={`/dashboard/subtasks/${subtask.id}/`}
                                        className={`
                                            block text-gray-900 text-[16px] md:text-[18px] font-medium 
                                            hover:${statusStyle.textColor} transition-colors duration-200
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${statusStyle.borderColor} rounded-md
                                            select-text flex items-start gap-2
                                        `}
                                    >
                                        <span className="i-heroicons-clipboard-document-list text-blue-500 text-[18px] mt-1 flex-shrink-0"></span>
                                        <span>{subtask.job}</span>
                                    </Link>
                                )}
                                
                                {/* Subtask Types */}
                                {subtask.subtask_types && subtask.subtask_types.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                                        {subtask.subtask_types.map((type, index) => {
                                            const subtaskInfo = getSubtaskByKey(type.type);
                                            return (
                                                <span 
                                                    key={index}
                                                    className="px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-md"
                                                >
                                                    {subtaskInfo?.label || type.type}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            
                            {/* Desktop için durum göstergesi */}
                            <div className={`${statusStyle.bgColor} h-[28px] hidden md:flex items-center gap-[6px] px-[12px] py-[6px] rounded-full`}>
                                <div className={`h-[8px] w-[8px] rounded-full ${statusStyle.circleColor}`}></div>
                                <div className={`${statusStyle.textColor} text-[12px] leading-[16px] font-medium`}>
                                    {currentStatus.status_display}
                                </div>
                            </div>
                        </div>
                        
                        {/* Tarih bilgisi - Sadece iconlar */}
                        <div className="flex items-center gap-4  rounded-lg p-1.5 select-text">
                            <div className="flex items-center gap-1.5 text-gray-700">
                                <HiCalendar className="text-blue-500 text-[16px]" />
                                <span className="text-xs font-medium">{formatDate(subtask.started_date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-gray-700">
                                <HiFlag className="text-red-500 text-[16px]" />
                                <span className="text-xs font-medium">{formatDate(subtask.deadline)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sağ taraftaki kullanıcı bilgisi ve detay butonu */}
                    <div className="flex items-center gap-[16px]">
                        <div className='flex flex-col items-end gap-[14px]'>
                            
                            <div className='font-medium text-[14px] text-gray-800 flex items-center gap-[8px] select-text  rounded-lg p-1.5'>
                                <Image className='rounded-full min-w-[20px] w-[20px] min-h-[20px] whitespace-nowrap' width={100} height={100} src={subtask.assigned_user.user.user_profile.image || '/default-avatar.png'} alt={subtask.assigned_user.user.full_name} />
                                <span>{subtask.assigned_user.user.full_name}</span>
                            </div>
                            
                            {/* Detay butonu ve Əlaqəli bilgisi */}
                            <div className="flex items-center gap-3 mt-2">
                                {previous_subtask && (
                                    <div className='flex items-center gap-[4px] text-[11px] text-gray-600 select-text bg-gray-50 rounded-lg p-1.5'>
                                        <HiFlag className="text-green-500 text-[16px]" />
                                        <span className="font-medium text-blue-700 truncate max-w-[120px]">{previous_subtask?.job || previous_subtask?.subtask_types.map((type) => getSubtaskByKey(type.type)?.label).join(', ')}</span>
                                    </div>
                                )}
                                
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-shrink-0"
                                >
                                    <Link 
                                        href={`/dashboard/subtasks/${subtask.id}/`}
                                        className='bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-[28px] px-[10px] flex items-center gap-[4px] rounded-full shadow-sm hover:shadow-md transition-all duration-200'
                                    >
                                        <FiExternalLink className="text-white text-[12px]" />
                                        <span className='text-[11px] leading-[16px] text-white font-medium'>Ətraflı</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* İlerleme yüzdesi göstergesi */}
                <div className="ml-[20px] w-[76px] relative">
                    <motion.div
                        className={`
                            ${['completed', 'accepted'].includes(currentStatus.status) 
                                ? 'bg-gradient-to-br bg-primary text-white ' 
                                : `bg-gradient-to-br bg-[#E8EAED] text-[#64717C] `} 
                            h-[50px] rounded-[16px] flex items-center justify-center font-medium
                            shadow-md hover:shadow-lg transition-all duration-300 border border-white/10
                        `}
                        initial={{ scale: 0.95, y: 5 }}
                        animate={{ 
                            scale: 1,
                            y: 0
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        {['completed', 'accepted'].includes(currentStatus.status) ? Math.floor(persentage) : 0}{' '}%
                    </motion.div>
                    
                    {/* Bağlantı çizgisi */}
                    {!isLast && subtask.next_subtask && (
                        <motion.div
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`
                                ${['completed', 'accepted'].includes(currentStatus.status) 
                                    ? 'bg-gradient-to-b bg-primary' 
                                    : `bg-gradient-to-b bg-[#E8EAED]`} 
                                absolute w-[6px] rounded-full left-[35px]
                                ${
                                    ['completed'].includes(currentStatus.status) 
                                    ? ' h-[140px] bottom-[-150px]':
                                    'h-[80px] bottom-[-90px]'
                                }
                                transition-colors duration-300 shadow-md
                            `}
                        ></motion.div>
                    )}
                </div>
            </motion.div>
            <motion.div 
                className='flex flex-wrap gap-[12px] justify-end ml-[16px] w-[calc(100%-108px)]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                
                {currentStatus.status === 'completed' && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAcceptTask} 
                        type='button' 
                        className='bg-[#E9FFEC] hover:bg-[#D6F5D6] h-[36px] px-[12px] flex items-center gap-[8px] rounded-full shadow-sm hover:shadow-md transition-all duration-200'
                    >
                        <Check />
                        <span className='text-[13px] leading-[20px] text-[#21A931] font-medium'>Təsdiq edirəm</span>
                    </motion.button>
                )}
                
                {currentStatus.status === 'completed' && (
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <NotAcceptedModal subtask={subtask}/>
                    </motion.div>
                )}
                
                {/* <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-gradient-to-r from-[#6366F1] to-[#4F46E5] h-[36px] px-[14px] flex items-center gap-[8px] rounded-full shadow-sm hover:shadow-md transition-all duration-200'
                >
                    <Edit />
                    <span className='text-[13px] leading-[20px] text-white font-medium'>Redaktə et</span>
                </motion.button> */}
              
                
                {/* <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-gradient-to-r from-[#EF4444] to-[#DC2626] h-[36px] px-[14px] flex items-center gap-[8px] rounded-full shadow-sm hover:shadow-md transition-all duration-200'
                >
                    <Reject />
                    <span className='text-[13px] leading-[20px] text-white font-medium'>Ləğv et</span>
                </motion.button> */}
            </motion.div>
            {subtask.next_subtask && (
                // <div className="relative z-0">
                    <SubtaskItem 
                        isLast={isLast} 
                        subtask={subtask.next_subtask} 
                        persentage={persentage} 
                        previous_subtask={subtask} 
                    />
                // </div>
            )}
        </>
    )
}

export default SubtaskItem