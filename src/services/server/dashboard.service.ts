import { DashboardStatistic } from "@/types/dashboard.type";
import { get } from "@/utils/apiClient";

export const getDashboardStatisticService = async () => {
  const response = await get<DashboardStatistic>(
    "/api/dashboard/statistic/"
  );
  return response;
};