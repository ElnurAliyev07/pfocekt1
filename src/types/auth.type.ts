export interface AuthTokens {
  refresh: string;
  access: string;
}

// UserProfile interface
export interface UserProfile {
  id: number;
  profession?: Profession;
  other_professions: OtherProfession[];
  user_languages: UserLanguages[];
  skills: Skills[];
  description: string | null;
  phone_number: string | null;
  image?: string;
  background_image?: string;
  facebook_link: string | null;
  instagram_link: string | null;
  tiktok_link: string | null;
  youtube_link: string | null;
  gender: Gender;
  date_of_birth: string;
  rating: number | null;
  experiences: Experience[];
  educations: Education[];
  location?: string;
  salaries: {
    salary_type: "monthly" | "project_based" | "package_based";
    amount: number;
    is_visible: boolean;
    profile: number;
  }[];
  is_freelancer: boolean;
}

export interface Experience {
  id: number;
  institution: string;
  started_year: number;
  finished_year: number;
  description: string;
  profile: number;
}

export interface Education {
  id: number;
  institution: string;
  started_year: number;
  finished_year: number;
  description: string;
  profile: number;
}

export interface Gender {
  key: "male" | "female";
  label: string;
}

export interface ActivePeriod {
  task: number;
  subtask: number;
  start: string;
  end: string;
}

export interface Profession {
  id?: number;
  name: string;
}

export interface Skills {
  id: number;
  name: string;
  profile: number;
}

export interface UserLanguages {
  id: number;
  language: Language;
  level: string;
  user_profile: number;
}

export interface Language {
  id: number;
  name: string;
}

export interface OtherProfession {
  id: number;
  name: string;
}

// User interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  user_profile: UserProfile;
  active_periods: ActivePeriod[];
  created: string;
}

// AuthResponse interface
export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface RegisterResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OTPVerifyResponse {
  message: string;
}
