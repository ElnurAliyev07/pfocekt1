import { TaskMessage } from "@/types/chat.type";
import { get } from "@/utils/apiClient";

export const getTaskMessageService = async (
    task_id: string
  ) => {
    try {
      const response = await get<TaskMessage []>(
        "/api/chat/task-messages/",
        {
            params: {
                task_id: task_id,
            }
        }
      );
      return response; // API'den gelen ham veriyi döndür
    } catch (error) {
      console.error("Error fetching plannings from API:", error);
      throw error; // Hata durumunda fırlat
    }
  };
  