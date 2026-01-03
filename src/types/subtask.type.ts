import { User } from "./auth.type";
import { CustomFile } from "./customFile.type";
import { Task } from "./task.type";
import { SubtaskKey } from "./task_helper.type";

interface AssignedUser {
  id: number;
  user: User;
  role: string;
}

export interface SubtaskStatus {
  status: "pending" | "must_be_done" | "must_be_done_again" | "in_progress" | "completed" | "rejected" | "accepted" ;
  status_display: string;
}


export interface SubtaskStatusHistory {
  id: number;
  previous_status: string;
  new_status: string;
  changed_at: string;
  subtask: number;
  changed_by: User | null;
}

export interface SubtaskType {
  id: number;
  type: SubtaskKey;
}

export interface SubTask {
  id: number;
  job: string;
  subtask_creator: string;
  task: Task;
  started_date: string;
  deadline: string;
  content: string;
  subtask_files: CustomFile [];
  completed: boolean;
  assigned_to: number;
  assigned_user: AssignedUser;
  subtask_task_admin: string;
  subtask_status: SubtaskStatus;
  feedback_text: string;
  subtask_checker?: number;
  feedback_files: CustomFile[];
  next_subtask?: SubTask;  // Doğru referans
  previous_subtasks: number [];  // Doğru referans
  status_history: SubtaskStatusHistory [];
  subtask_types: SubtaskType [];
}

export interface CreateSubtask {
  job: string;
  task: number;
  started_date: string;
  deadline: string;
  content: string;
  subtask_files?: string [];
  assigned_to: number;
  task_checker?: number;
}

export interface SubtaskBulkCreateItem {
  job: string;
  subtask_types: {
    type: SubtaskKey;
  }[];
  started_date: string;
  deadline: string;
  content: string;
  subtask_files?: string [];
  assigned_to: number;
  subtask_checker?: number;
  next_subtask_temp_id: number | null;
}

export interface SubtaskBulkCreate {
  subtasks: SubtaskBulkCreateItem[];
}

