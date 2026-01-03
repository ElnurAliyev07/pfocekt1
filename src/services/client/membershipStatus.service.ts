import { KeyLabel } from "@/types/membershipStatus.type";
import { get } from "@/utils/apiClient";

export const getMembershipStatusService = async () => {
    const response = await get<KeyLabel[]>(
      "/api/dashboard/status/membership/"
    );
    return response;
  };
  