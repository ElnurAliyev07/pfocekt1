import { SubTask } from "@/types/subtask.type";
import { get } from "@/utils/apiClient";


export const getSubtaskItemService = async ({ id }: { id: number }) => {
  const response = await get<SubTask>(
    `/api/dashboard/subtasks/${id}/`
  );
  return response;
};

