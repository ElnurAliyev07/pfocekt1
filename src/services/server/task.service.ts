import { Task } from "@/types/task.type";
import { get } from "@/utils/apiClient";


export const getTaskItemService = async ({ id }: { id: number }) => {
  const response = await get<Task>(
    `/api/dashboard/tasks/${id}/`
  );
  return response;
};

