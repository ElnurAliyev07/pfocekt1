import { Config } from "@/types/config.type";
import { get } from "@/utils/apiClient";

const DEFAULT_OPTIONS = { revalidate: 1000 };


export const getConfigService = async () => {
  const response = await get<Config>(
    "/api/config/",{
      ...DEFAULT_OPTIONS,
      skipAuth: true
    }
  );
  return response;
};