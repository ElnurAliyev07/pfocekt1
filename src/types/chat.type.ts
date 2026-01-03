import { User } from "./auth.type"

export interface TaskMessage {
    id: number,
    user: User
    message: string,
    created_at: string,
    task: number
  }
