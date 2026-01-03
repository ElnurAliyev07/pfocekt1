export interface Blog {
    blog_title: string;
    slug: string;
    blog_content: string;
    blog_image: string;
    status: string;
    created: string;
    updated: string;
    view_count: string;
    tag: {
        id: number;
        created: string;
        updated: string;
        tag_name: string;
    }[];
    category: {
        id: number;
        created: string;
        updated: string;
        category_name: string;
    };
}


export interface BlogHero {
    id: number;
    created: string;
    updated: string;
    title: string;
    description: string;
}
