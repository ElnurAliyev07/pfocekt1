"use client";

import { getMembershipStatusService } from "@/services/client/membershipStatus.service";
import { getPlatformService } from "@/services/client/platform.service";
import { getProfessionService } from "@/services/client/profession.service";
import { GeneralStore } from "@/types/generalStore.type";
import { create } from "zustand";

const useGeneralStore = create<GeneralStore>((set) => ({
  memberShipStatuses: [],
  platforms: [],
  professions: [],

  fetchMemberShipStatuses: async () => {
    try {
      const response = await getMembershipStatusService(); // API'den veriyi çek

      set({
        memberShipStatuses: response.data,
      });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  },
  fetchPlatforms: async () => {
    try {
      const response = await getPlatformService(); // API'den veriyi çek

      set({
        platforms: response.data    ,
      });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  },

  fetchProfessions: async () => {
    try {
      const response = await getProfessionService(); // API'den veriyi çek

      set({
        professions: response.data,
      });
    } catch (error) {
      console.error("Error fetching professions:", error);
    }  },
}));

export default useGeneralStore;