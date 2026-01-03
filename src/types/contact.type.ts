export interface ContactInfo {
    id: number;
    emails: {
      id: number;
      created: string;
      updated: string;
      email: string;
      info: number;
    }[];
    phones: {
      id: number;
      created: string;
      updated: string;
      phone: string;
      info: number;
    }[];
    created: string;
    updated: string;
    title: string;
    description: string;
    location: string;
    location_iframe_link: string;
  }
  