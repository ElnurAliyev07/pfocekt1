export interface Statistics {
    id: number;
    created: string;
    updated: string;
    freelancer: number;
    projects: number;
    company: number;
    order: number;
    number_of_hires: number;
    aboutUs: number;
}

export interface Punkt {
    id: number;
    created: string;
    updated: string;
    title: string;
    about: number;
}

export interface AboutSection {
    id: number;
    statistic: Statistics
    punkts: Punkt[];
    created: string;
    updated: string;
    description: string;
    hero_image_overlay: string;
}

