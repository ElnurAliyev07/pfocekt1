import { AboutSection } from "@/types/about.type";
import { API_URL } from "@/utils/constants";

export const getAboutSectionService = async () => {
   
    const response: AboutSection[] = await fetch(`${API_URL}/api/pages/about/`, {
        method: "GET",
        cache: "no-cache"
    }).then(res => res.json());
    return response;
};