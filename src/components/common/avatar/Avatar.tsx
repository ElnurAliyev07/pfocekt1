import React from 'react';
import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';
import { User } from '@/types/auth.type';
import { HoverCard } from "@radix-ui/themes";
import Link from 'next/link';

interface Props {
    user?: User;
    size?: 'sm' | 'md' | 'lg';
    showHover?: boolean;
}

const Avatar: React.FC<Props> = ({ user, size = 'md', showHover = true }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
        lg: 'w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56'
    };

    if (!user) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-white bg-gradient-to-br from-gray-100 to-gray-200`}>
                <Image
                    src="/grid.png"
                    alt="Default avatar"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-white transition-all duration-300 hover:scale-105 hover:ring-blue-100 hover:shadow-lg`}>
                    <Image
                        src={user.user_profile?.image || '/grid.png'}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover bg-gradient-to-br from-gray-100 to-gray-200"
                    />
                </div>
            </HoverCard.Trigger>
            <HoverCard.Content className="w-72 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100 shadow-sm">
                        <Image
                            src={user.user_profile?.image || '/grid.png'}
                            alt={`${user.first_name} ${user.last_name}`}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover bg-gradient-to-br from-gray-100 to-gray-200"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                        </h3>
                        {
                            user.user_profile?.profession?.name && (
                                <p className="text-xs text-gray-600 truncate">
                                    {user.user_profile?.profession?.name}
                                </p>
                            )
                        }
                      
                    </div>
                    <Link 
                        href={`/dashboard/profile/${user.id}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-2.5">
                    {user.email && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <FiMail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                    )}
                    {user.user_profile?.phone_number && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <FiPhone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span>{user.user_profile.phone_number}</span>
                        </div>
                    )}
                    {user.user_profile?.location && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <FiMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{user.user_profile.location}</span>
                        </div>
                    )}
                </div>

                {user.user_profile?.other_professions?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1.5">
                            {user.user_profile.other_professions.map((profession, index) => (
                                <span
                                    key={index}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100"
                                >
                                    {profession.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </HoverCard.Content>
        </HoverCard.Root>
    );
};

export default Avatar;