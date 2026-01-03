import { Category, ContactSection, ExpertSection, HeroSection, HowToWork, Partner, Statistic, Testimonial } from "@/types/home.type";
import { get } from "@/utils/apiClient";

const DEFAULT_OPTIONS = { revalidate: 1000 };


export const getHeroSectionService = async () => {
    const response = await get<HeroSection[]>(
      "/api/pages/home/hero/",{
        ...DEFAULT_OPTIONS
      }
    );
    return response;
};

export const getContactSectionService = async () => {
  const response = await get<ContactSection[]>(
    "/api/pages/home/contact/",{
        ...DEFAULT_OPTIONS
      }
  );
  return response;
};

export const getExpertSectionService = async () => {
  const response = await get<ExpertSection[]>(
    "/api/pages/home/expert-section/",{
        ...DEFAULT_OPTIONS
      }
  );
  return response;
};

export const getPartnerSectionService = async () => {
    const response = await get<Partner[]>(
      "/api/pages/home/partners/",{
        ...DEFAULT_OPTIONS
      }
    );
    return response;
};

export const getHowToWorkSectionService = async () => {
  const response = await get<HowToWork[]>(
    "/api/pages/home/how-to-work/",{
        ...DEFAULT_OPTIONS
      },
  );
  return response;
};

export const getCategoriesSectionService = async () => {
  const response = await get<Category[]>(
    "/api/pages/home/freelancer-categories/",{
        ...DEFAULT_OPTIONS
      }
  );
  return response;
};

export const getStatisticSectionService = async () => {
  const response = await get<Statistic[]>(
    "/api/pages/home/statistic/",{
        ...DEFAULT_OPTIONS
      }
  );
  return response;
};

export const getTestimonialsService = async () => {
  const response = await get<Testimonial[]>(
    "/api/pages/home/customer-comments/",{
        ...DEFAULT_OPTIONS
      }
  );
  return response;
};