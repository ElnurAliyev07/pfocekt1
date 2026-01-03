import { ProjectMember } from "@/types/project.type";
import { create } from "zustand";
import { SubtaskKey } from "@/types/task_helper.type";

// TaskUser Interface
export interface TaskUser {
  order: number;
  projectMember: ProjectMember;
  job?: string;
  content?: string;
  files?: (File | null)[]; // Updated to array of files including null values
  started?: string;
  deadline?: string;
  timeLimit?: number;
  isPlanningPost?: boolean;
  profession?: string;
  taskChecker?: ProjectMember | undefined;
  nextSubtaskTemp?: number | null;
  subtask_types?: { type: SubtaskKey }[]; // Added subtask_types field
}

// ErrorMessages Interface
export interface TaskUserErrorMessages {
  job?: string[];
  content?: string[];
  files?: string[]; // Updated to match files array
  started?: string[];
  deadline?: string[];
  timeLimit?: string[];
  isPlanningPost?: string[];
  profession?: string[];
  taskChecker?: string[];
  nextSubtaskTemp?: string[];
  subtask_types?: string[]; // Added subtask_types error field
}

// Store Interface
interface TaskUserStore {
  started: string;
  deadline: string;
  selectedUsers: TaskUser[];
  selectedTaskChecker: ProjectMember | null;
  selectedAssigner: ProjectMember | null;
  selectedUser: TaskUser | null;
  errorMessages: { [order: number]: TaskUserErrorMessages }; // Updated type
  setStarted: (started: string) => void;
  setDeadline: (deadline: string) => void;
  setSelectedUser: (user: TaskUser) => void;
  setSelectedTaskChecker: (user: ProjectMember | null) => void;
  setSelectedAssigner: (user: ProjectMember | null) => void;
  addUser: (user: TaskUser) => void;
  removeUser: (order: number) => void;
  reset: () => void;
  updateUserTaskChecker: (order: number, user: ProjectMember | undefined) => void;
  updateUserNextSubtaskTemp: (order: number, nextSubtaskTemp: number | null) => void;
  updateUserJob: (order: number, job: string) => void;
  updateUserContent: (order: number, content: string) => void;
  updateUserFiles: (order: number, files: (File | null)[]) => void; // Updated to handle files array
  addUserFile: (order: number) => void; // Add empty file placeholder
  updateUserFile: (order: number, file: File | null, index: number) => void; // Update specific file
  removeUserFile: (order: number, index: number) => void; // Remove specific file
  updateUserStarted: (order: number, started: string, minute?: number) => void;
  updateUserDeadline: (order: number, deadline: string) => void;
  clearFieldErrors: (order: number, field: keyof TaskUserErrorMessages) => void;
  clearAllErrors: (order: number) => void;
  updateUserSubtaskType: (order: number, types: { type: SubtaskKey }[]) => void;
}

// Utility function to add minutes
const addMinutes = (dateString: string, minutes: number): string => {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

// Zustand Store
const useTaskUserStore = create<TaskUserStore>((set, get) => ({
  selectedUsers: [],
  selectedUser: null,
  selectedTaskChecker: null,
  selectedAssigner: null,
  errorMessages: {}, // Başlangıçta boş
  started: "",
  deadline: "",
  setStarted: (started) => {
    set({ started });
  },
  setDeadline: (deadline) => {
    set({ deadline });
  },
  setSelectedTaskChecker: (user) => {
    set({ selectedTaskChecker: user });
  },
  setSelectedAssigner: (user) => {
    set({ selectedAssigner: user });
  },
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  addUser: (user) =>
    set((state) => ({
      selectedUsers: [...state.selectedUsers, user],
    })),
  removeUser: (order) =>
    set((state) => {
      const updatedUsers = state.selectedUsers
        .filter((user) => user.order !== order)
        .map((user, index) => ({
          ...user,
          order: index + 1, // Order yeniden düzenleniyor
        }));
      return { selectedUsers: updatedUsers };
    }),
  reset: () =>
    set({
      selectedUsers: [],
      started: "",
      deadline: "",
    }),
  updateUserContent: (order, content) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, content } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
          content: content ? [] : ["Xüsusi qeyd doldurulmalıdır."],
        },
      },
    })),
    updateUserJob: (order, job) =>
      set((state) => {
        const user = state.selectedUsers.find(u => u.order === order);
        const isSubtask = user?.subtask_types && user.subtask_types.length > 0;
        
        return {
        selectedUsers: state.selectedUsers.map((user) =>
          user.order === order ? { ...user, job } : user
        ),
        errorMessages: {
          ...state.errorMessages,
          [order]: {
            ...state.errorMessages[order],
              job: isSubtask ? [] : (job ? [] : ["Task başlığı doldurulmalıdır."]),
            },
          },
        };
      }),
  
  updateUserTaskChecker: (order, taskChecker) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, taskChecker } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
            taskChecker: [],
        },
      },
    })),
    updateUserFiles: (order, files) =>
      set((state) => ({
        selectedUsers: state.selectedUsers.map((user) =>
          user.order === order ? { ...user, files } : user
        ),
        errorMessages: {
          ...state.errorMessages,
          [order]: {
            ...state.errorMessages[order],
            files: [],
          },
        },
      })),
    addUserFile: (order) => {
      set((state) => ({
        selectedUsers: state.selectedUsers.map((user) =>
          user.order === order
            ? { ...user, files: [...(user.files || []), null] }
            : user
        ),
      }));
    },
    updateUserFile: (order, file, index) => {
      set((state) => ({
        selectedUsers: state.selectedUsers.map((user) => {
          if (user.order === order) {
            const updatedFiles = [...(user.files || [])];
            updatedFiles[index] = file;
            return { ...user, files: updatedFiles };
          }
          return user;
        }),
      }));
    },
    removeUserFile: (order, index) => {
      set((state) => ({
        selectedUsers: state.selectedUsers.map((user) => {
          if (user.order === order) {
            const updatedFiles = [...(user.files || [])];
            updatedFiles.splice(index, 1);
            return { ...user, files: updatedFiles };
          }
          return user;
        }),
      }));
    },
  updateUserNextSubtaskTemp(order, nextSubtaskTemp) {
    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, nextSubtaskTemp } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
            nextSubtaskTemp: [],
        },
      },
    }));
  },
  updateUserStarted: (order: number, started: string, minute?: number) => {
    const { selectedUsers } = get();
    const userIndex = selectedUsers.findIndex((user) => user.order === order);
    if (userIndex === -1) return;

    const newErrors: string[] = [];

    if (!started) {
      newErrors.push("Başlama tarixi seçilməlidir.");
    }

    // Check if start date is in the past
    if (started && new Date(started) <= new Date()) {
      newErrors.push("Başlama tarixi cari tarixdən sonra olmalıdır.");
    }

    const newDeadline =
      minute !== undefined ? addMinutes(started, minute) : selectedUsers[userIndex].deadline;

    if (newDeadline && new Date(newDeadline) < new Date(started)) {
      newErrors.push("Bitmə tarixi başlama tarixindən sonra olmalıdır.");
    }

    if (newErrors.length > 0) {
      set((state) => ({
        errorMessages: {
          ...state.errorMessages,
          [order]: {
            ...state.errorMessages[order],
            started: newErrors,
          },
        },
      }));
      return;
    }

    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, started, deadline: newDeadline } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
          started: [],
          deadline: []
        },
      },
    }));
  },
  updateUserDeadline: (order: number, deadline: string) => {
    const { selectedUsers } = get();
    const userIndex = selectedUsers.findIndex((user) => user.order === order);
    if (userIndex === -1) return;

    const started = selectedUsers[userIndex].started;
    const newErrors: string[] = [];

    if (!deadline) {
      newErrors.push("Bitmə tarixi seçilməlidir.");
    }

    // Check if deadline is in the past
    if (deadline && new Date(deadline) <= new Date()) {
      newErrors.push("Bitmə tarixi cari tarixdən sonra olmalıdır.");
    }

    if (started && new Date(deadline) < new Date(started)) {
      newErrors.push("Bitmə tarixi başlama tarixindən sonra olmalıdır.");
    }

    if (newErrors.length > 0) {
      set((state) => ({
        errorMessages: {
          ...state.errorMessages,
          [order]: {
            ...state.errorMessages[order],
            deadline: newErrors,
          },
        },
      }));
      return;
    }

    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, deadline } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
          deadline: [],
        },
      },
    }));
  },
  clearFieldErrors: (order, field) =>
    set((state) => ({
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
          [field]: [],
        },
      },
    })),
  clearAllErrors: (order) =>
    set((state) => ({
      errorMessages: {
        ...state.errorMessages,
        [order]: {},
      },
    })),
  updateUserSubtaskType: (order: number, types: { type: SubtaskKey }[]) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.map((user) =>
        user.order === order ? { ...user, subtask_types: types } : user
      ),
      errorMessages: {
        ...state.errorMessages,
        [order]: {
          ...state.errorMessages[order],
          subtask_types: types.length > 0 ? [] : ["Alt task növü seçilməlidir."],
        },
      },
    })),
}));

export default useTaskUserStore;
