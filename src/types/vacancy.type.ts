import { User } from "./auth.type";

export interface Vacancy {
  id: number;
  slug: string;
  title: string;
  started: string;
  workspace: VacancyWorkspace;
  creator: User;
  category: VacancyCategory;
  ended: string;
  establishment: string | null;
  location: string | null;
  experience_start: number | null;
  experience_finish: number | null;
  work_schedulers: WorkScheduler[];
  work_modes: WorkMode[];
  vacancy_descriptions: VacancyDesctiption[];
  vacancy_requirements: VacancyRequirement[];
  salary: string | null;
  view_count: number;
  is_active: boolean;
  created: string;
  updated: string;
}

interface VacancyDesctiption {
  description: string;
}

interface VacancyRequirement {
  requirement: string;
}

export interface VacancyCategory {
  id: number;
  created: string;
  updated: string;
  title: string;
}

export interface WorkScheduler {
  id: number;
  created: string;
  updated: string;
  title: string;
}

export interface WorkMode {
  id: number;
  created: string;
  updated: string;
  title: string;
}

interface VacancyWorkspace {
  title: string;
}
