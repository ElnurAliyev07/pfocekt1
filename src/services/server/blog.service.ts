import { Blog, BlogHero } from "@/types/blog.type";
import { PaginatedResponse } from "@/types/response.type";
import { get } from "@/utils/apiClient";

export const getBlogService = async (
  page?: number,
  page_size?: number
) => {
  try {
    const response = await get<PaginatedResponse<Blog>>(
      "/api/blogs/",
      {
        params: {
          page: page,
          page_size: page_size
      } as Record<string, string | number | string[] | number[]>
    }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching blogs from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const getMainBlogService = async () => {
  try {
    const response = await get<Blog>(
      "/api/blogs/main-blog/"
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching blogs from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

export const getBlogHeroService = async () => {
  try {
    const response = await get<BlogHero []>(
      "/api/blogs/hero/"
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching blogs from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

export const getBlogDetailService = async (slug: string) => {
  try {
    const response = await get<Blog>(`/api/blogs/${slug}/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};