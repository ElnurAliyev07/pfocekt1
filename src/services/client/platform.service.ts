import { KeyLabel } from "@/types/membershipStatus.type";
import { get } from "@/utils/apiClient";

export const getPlatformService = async () => {
    const response = await get<KeyLabel[]>(
      "/api/dashboard/platforms/"
    );
    return response;
  };
  