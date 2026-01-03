import React, { useState } from 'react';
import Queates from '../../ui/icons/Queates';
import Image from 'next/image';
import { Testimonial } from '@/types/home.type';

interface Props {
    data: Testimonial;
}

const CustomerComment: React.FC<Props> = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const commentLimit = 100;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="h-[486px] flex flex-col items-center justify-center md:opacity-35">
            <div className="pt-[38px] pr-[23px] pb-[28px] pl-[38px] max-h-[368px] flex items-center gap-[22px] rounded-[30px] bg-[#E1F3FF] border-2 border-white mb-[28px]">
                <div className="customer-comment-quates">
                    <Queates />
                </div>
                <p className="text-[14px] leading-[20px] font-normal text-t-black md:text-t-gray">
                    {isExpanded
                        ? data.comment
                        : `${data.comment.slice(0, commentLimit)}`}
                    {data.comment.length > commentLimit && (
                        <button
                            onClick={toggleExpand}
                            className='ml-1 text-primary'
                        >
                            {isExpanded ? 'Daha az' : '...'}
                        </button>
                    )}
                </p>
            </div>

            <div className="w-[170px] flex flex-col items-center pb-[50px]">
                <div className="w-[20px] h-[20px] bg-primary rounded-full mb-[15px]"></div>
                <div className="w-[37px] h-[37px] bg-primary rounded-full"></div>

                <div className="w-[64px] h-[64px] md:w-[117px] md:h-[117px] rounded-full overflow-hidden mt-[37px]">
                    <Image
                        width={500}
                        height={500}
                        className="w-full h-full rounded-full object-cover object-center"
                        src={data.profile_image}
                        alt="user"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerComment;
