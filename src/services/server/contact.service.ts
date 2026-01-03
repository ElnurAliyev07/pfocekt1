import { ContactInfo } from "@/types/contact.type";

import { API_URL } from "@/utils/constants";

export const getContactInfoService = async () => {
   
    const response: ContactInfo[] = await fetch(`${API_URL}/api/pages/contact/info/`, {
        method: "GET",
        cache: "no-cache"
    }).then(res => res.json());
    return response;
};