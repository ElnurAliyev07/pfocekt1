import { CreateSubtask, SubTask, SubtaskBulkCreate } from "@/types/subtask.type";
import { get, post, put } from "@/utils/apiClient";

export const getSubTaskService = async (
  task: number
) => {
  try {
    const response = await get<SubTask []>(
      "/api/dashboard/subtasks/",
      {
        params: {
          task,
        }
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const createSubTaskService = async (data: CreateSubtask) => {
  const endpoint = "/api/dashboard/subtasks/";
  return post<SubTask, CreateSubtask>(endpoint, data);
};



export const createSubTaskBulkService = async (data: SubtaskBulkCreate) => {
  const endpoint = "/api/dashboard/subtasks/bulk-create/";
  return post<SubTask, SubtaskBulkCreate>(endpoint, data);
};


export const startSubTaskService = async (pk: number) => {
  const endpoint = `/api/dashboard/subtasks/${pk}/start/`;
  return post<SubTask, {}>(endpoint, {});
};

interface CompleteTaskRequest {
  feedback_text: string;
  feedback_files: string[];
}

export const completeSubTaskService = async (pk: number, data: CompleteTaskRequest) => {
  const endpoint = `/api/dashboard/subtasks/${pk}/complete/`;
  return put<SubTask, CompleteTaskRequest>(endpoint, data);
};

export const updateSubTaskResultService = async (pk: number, data: CompleteTaskRequest) => {
  const endpoint = `/api/dashboard/subtasks/${pk}/result-edit/`;
  return put<SubTask, CompleteTaskRequest>(endpoint, data);
};


export const acceptSubtaskService = async (pk: number) => {
  const endpoint = `/api/dashboard/subtasks/${pk}/accept/`;
  return post<SubTask, {}>(endpoint, {});
};

export interface RejectSubtaskRequest {
  started_date: string;
  deadline: string;
  rejected_reason: string;
  next_subtask_updates?: {
    started_date: string;
    deadline: string;
  }[];
}

export const rejectSubtaskService = async (pk: number, data: RejectSubtaskRequest) => {
  const endpoint = `/api/dashboard/subtasks/${pk}/reject/`;
  return put<SubTask, RejectSubtaskRequest>(endpoint, data);
};

