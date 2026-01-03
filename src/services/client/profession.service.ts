import { Profession } from "@/types/profession.type";
import { get } from "@/utils/apiClient";

export const getProfessionService = async () => {
    const response = await get<Profession[]>(
      "/api/dashboard/professions/"
    );
    return response;
  };
  