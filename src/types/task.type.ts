import { User } from "./auth.type";
import { CustomFile } from "./customFile.type";
import { PlanningPost } from "./planning.type";
import { Project } from "./project.type";
import { ContentType, SocialMediaPlatform } from "./social-media.type";
import { SubTask, SubtaskBulkCreateItem } from "./subtask.type";

interface TaskMember {
  id: number;
  user: User;
  role: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  content?: string;
  task_files?: string[];
  ready_content?: string;
  priority?: string;
  project: number;
  completed?: boolean;
  started?: string;
  deadline?: string;
  sharing_date?: string;
  client_accepted?: boolean;
  task_checker?: number;
  task_assigner?: number;
  planning_post?: number;
  subtasks?: SubtaskBulkCreateItem[];
  is_social_media_task?: boolean;
  joint_post?: boolean;
  platform_schedules?: {
    platform: SocialMediaPlatform;
    content_type: ContentType;
    scheduled_date: string | null;
  }[];
}

export interface UpdateTask {
  title: string;
  content: string;
  task_files: string[];
  priority: "highest" | "normal" | "lowest";
  project: number;
  completed: boolean;
  started: string;
  deadline: string;
  client_accepted: boolean;
  task_checker: number;
  task_assigner: number;
  planning_post: number;
  subtasks: SubtaskBulkCreateItem[];
  is_social_media_task: boolean;
}

export interface TaskStatus {
  key:
    | "pending"
    | "must_be_done"
    | "must_be_done_again"
    | "in_progress"
    | "completed"
    | "rejected"
    | "accepted"
    | "cancelled";
  label: string;
}

export interface TaskStatusHistory {
  id: number;
  previous_status: string;
  new_status: string;
  changed_at: string;
  task: number;
  changed_by: User | null;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  content: string;
  status: TaskStatus;
  assigned_members: TaskMember[];
  task_files: CustomFile[];
  ready_content: string;
  priority: string;
  task_assigner?: number;
  task_creator: number;
  task_checker: number,
  project: Project;
  completed_percent: string;
  completed: boolean;
  members_count: string;
  subtasks_count: string;
  get_absolute_url: string;
  started: string;
  deadline: string;
  created_date: string;
  sharing_date: string;
  client_accepted: boolean;
  planning_post: PlanningPost;
  message_count: string;
  feedback_text?: string;
  feedback_files: CustomFile[];
  status_history: TaskStatusHistory[];
  rejected_reason?: string;
  subtasks: SubTask[];
  is_social_media_task: true;
  post: {
    id: number;
    user: number;
    planning_post: number;
    task: number;
    content: string;
    joint_post: boolean;
    created_at: string;
    updated_at: string;
    is_recurring: boolean;
    recurrence_rule: string;
    recurrence_end_date: string;
    platform_schedules: [
      {
        id: number;
        content_override: string;
        platform: SocialMediaPlatform;
        content_type: ContentType;
        scheduled_date: string;
        published_date: string;
        status: "draft" | "scheduled" | "published" | "failed";
        medias: {
          id: number;
          file: string;
        }[],
        first_comment: string,
        hashtags: {
          id: number;
          name: string;
        }[],
        mentioned_users: {
          id: number;
          username: string;
        }[],
        retry_count: number,
        last_retry_attempt_at: string,
        error_message: string,
        publishing_task_id: string,
        title: string,
        description: string,
        tags_input: string,
        category: string,
        music: string,
        effects: string,
        cover_image: string,
        thumbnail: string,
        duration: number,
        aspect_ratio: string,
        slides_count: number,
        location: string,
        link: string,
      }
    ],
    medias: {
      id: number;
      file: string;
    }[]
  }
}

export interface SharingType {
  id: number;
  title: string;
}
