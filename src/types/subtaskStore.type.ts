import { SubTask } from "./subtask.type";

export type SubtaskStore = {
  task: number;
  isLoading: boolean;
  subtasks: SubTask[];
  error: string | null;
  setTask: (task:number) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  fetchSubtasks: () => Promise<void>;
};
