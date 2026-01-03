"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown/Dropdown";
import Image from "next/image";
import React from "react";
import Star from "../../ui/icons/Star";
import useLogout from "@/hooks/useLogout";
import { useAuth } from "@/providers/AuthProvider";

const Profile = () => {
    const { user } = useAuth();
    const { logout } = useLogout();

    return (
        <Dropdown >
            <DropdownTrigger  nested={false}>
                <div className="flex items-center gap-3">
                    <Image
                        className="bg-primary rounded-full w-12 h-12 object-cover"
                        src={user?.user_profile?.image || "/default-avatar.png"}
                        alt="user_profile"
                        width={500}
                        height={500}
                    />
                    <div className="space-y-1">
                        <h2 className="text-t-black font-medium leading-5">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        {user?.user_profile?.profession?.name && (
                            <p className="text-xs leading-4 font-medium text-t-gray">
                                {user.user_profile.profession.name}
                            </p>
                        )}
                        <div className="flex items-center gap-1.5 text-primary">
                            <Star />
                            <span className="text-sm font-medium leading-4">4.5</span>
                        </div>
                    </div>
                </div>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem>
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">@{user?.email}</p>
                </DropdownItem>
                <DropdownItem>My Settings</DropdownItem>
                <DropdownItem>Team Settings</DropdownItem>
                <DropdownItem>Analytics</DropdownItem>
                <DropdownItem>System</DropdownItem>
                <DropdownItem>Configurations</DropdownItem>
                <DropdownItem>Help & Feedback</DropdownItem>
                <DropdownItem className="text-red-500">
                    <button onClick={() => logout()}>
                        Çıxış
                    </button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default Profile;
