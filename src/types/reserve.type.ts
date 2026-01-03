import { ContentType, SocialMediaPlatform } from "./social-media.type";

export interface Reserve {
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
    scheduled_date: string | null;
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

