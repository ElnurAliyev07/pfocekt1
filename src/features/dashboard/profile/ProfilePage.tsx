"use client";

import React from "react";

import { useAuth } from "@/providers/AuthProvider";

import OwnerView from "./components/OwnerView";
import OtherView from "./components/OtherView";
import { User } from "@/types/auth.type";

interface ProfileProps {
  initialUser?: User;
}

const ProfilePage: React.FC<ProfileProps> = ({ initialUser }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        Profil tapılmadı və ya yüklənir...
      </div>
    );
  }
  const isOwner = user && initialUser?.id === user.id;
  return isOwner ? <OwnerView /> : <OtherView user={initialUser} />;
};

export default ProfilePage;
