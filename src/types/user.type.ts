export interface UserUpdateRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    user_profile?: {
      image?: string | null;
      background_image?: string | null;
      description?: string | null;
      phone_number?: string | null;
      facebook_link?: string | null;
      instagram_link?: string | null;
      tiktok_link?: string | null;
      youtube_link?: string | null;
      gender?: "male" | "female" | null;
      date_of_birth?: string | null;
      user_languages?: Array<{
        id?: number;
        language?: {
          id?: number;
          name?: string;
        };
        level?: string;
      }>;
      experiences?: Array<{
        id?: number;
        institution?: string;
        started_year?: number;
        finished_year?: number;
        description?: string;
      }>;
      educations?: Array<{
        id?: number;
        institution?: string;
        started_year?: number;
        finished_year?: number;
        description?: string;
      }>;
      skills?: Array<{
        id?: number;
        name: string;
        profile?: number;
      }>;
      location?: string;
      main_profession?: string;
      salaries?: Array<{
        salary_type: "monthly" | "project_based" | "package_based";
        amount: number;
        is_visible: boolean;
        profile: number;
      }>;
      is_freelancer?: boolean;
    };
  }