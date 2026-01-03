"use client";
import React from "react";

import TabMenu from "../components/TabMenu";
import ProfilePage from "@/features/dashboard/profile/ProfilePage";
import { useAuth } from "@/providers/AuthProvider";

const ClientPage = () => {
  const { user } = useAuth();
  return (
    <div>
      <TabMenu />
      <div className="md:mt-[56px]">
        {user && <ProfilePage initialUser={user} />}
      </div>
    </div>
  );
};

export default ClientPage;
