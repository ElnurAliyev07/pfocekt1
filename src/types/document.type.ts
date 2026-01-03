import { User } from "./auth.type";

export interface Document {
  id: number;
  title: string;
  file: string;
  mime_type: string;
  size: number;
  created: string;
  updated: string;
  user: User | null;
  related_object_display: string;
}
