"use client";

// import { DropdownRoot, DropdownItem } from "@/components/ui/dropdown";
import Image from "next/image";
import React from "react";
import useLogout from "@/hooks/useLogout";
import Star from "../ui/icons/Star";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown/Dropdown";

const Profile = () => {
    const { user } = useAuth();
    const { logout } = useLogout();
    const router = useRouter();

    const trigger = (
        <div className="flex items-center gap-3 cursor-pointer">
            <Image
                className="bg-white rounded-full lg:w-12 lg:h-12 w-8 h-8 object-cover"
                src={user?.user_profile?.image || "/grid.png"}
                alt="profil şəkli"
                width={500}
                height={500}
            />
            <div className="hidden lg:block">
                <h2 className="text-t-black font-medium leading-5">
                    {user?.first_name} {user?.last_name}
                </h2>
                {user?.user_profile.profession && (
                    <p className="text-xs text-t-gray">
                        {user.user_profile.profession.name}
                    </p>
                )}
                {user?.user_profile.rating && (
                    <div className="flex items-center gap-1.5 text-primary">
                        <Star />
                        <span className="text-sm font-medium">{user.user_profile.rating}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Dropdown>
            <DropdownTrigger variant="ghost" nested={false} >
                {trigger}
            </DropdownTrigger>
            <DropdownMenu>
            <DropdownItem>
                <div className="flex items-center gap-1">
                    <p className="font-bold whitespace-nowrap">Daxil olan:</p>
                    <p className="font-bold">@{user?.email}</p>
                </div>
            </DropdownItem>
            <DropdownItem onClick={() => router.push('/dashboard/settings/profile')}>Profil</DropdownItem>
            <DropdownItem onClick={() => router.push('/dashboard/settings/advantages')}>Analitika</DropdownItem>
            <DropdownItem onClick={() => router.push('/dashboard/settings/security')}>Güvənlik</DropdownItem>
            <DropdownItem onClick={() => router.push('/dashboard/settings/change-password')}>Şifrəni dəyiş</DropdownItem>
            <DropdownItem onClick={() => router.push('/dashboard/settings/plan-invoice')}>Plan və fərqlər</DropdownItem>
            {/* <DropdownItem onPress={() => router.push('/dashboard/settings/help-feedback')}>Kömək və Rəy</DropdownItem> */}
            <DropdownItem className="text-red-500" onClick={logout}>
                Çıxış et
            </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default Profile;
