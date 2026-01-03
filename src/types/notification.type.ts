import { User } from "./auth.type";

export interface CustomNotification {
    id: number;
    recipient: number;
    notification_status: "pending" | "completed";
    notification_status_display: "string",
    notification_type: "workspace_created" | "workspace_updated" | "workspace_invitation" | "project_created" | "project_updated" | "task_created" | "task_updated" | "task_assigned" | "subtask_created" | "subtask_updated" | "comment_added" | "mention" | "document_shared" | "vacancy_created" | "freelancer_hired" | "payment_received";
    notification_type_display: string;
    sender: User,
    workspace: number,
    content_type: number,
    object_id: number,
    content_type_info: string,
    title: string,
    message: string,
    is_read: boolean,
    url: string,
    created_at: string,
    updated_at: string,
    time_since: string,
}