import { Portfolio } from "@/types/portfolio.type";
import { PaginatedResponse } from "@/types/response.type";
import api from "@/utils/apiClient";

export const getPortfolios = async (
    params?: {
      user: number;
    }
  ) => {
    const response = await api.get<PaginatedResponse<Portfolio>>(
      "/api/portfolios/",
      {
        params: {
          user: params?.user || 0,
        },
      }
    );
    return response;
  };
  

export interface CreatePortfolioRequest {
  title?: string;
  description?: string;
  link?: string;
  medias: {
    image: string;
    is_main: boolean;
  }[];
}

export const createPortfolio = async (data: CreatePortfolioRequest) => {
  const response = await api.post<Portfolio, CreatePortfolioRequest>("/api/portfolios/", data);
  return response;
};

export interface UpdatePortfolioRequest {
  title?: string;
  description?: string;
  link?: string;
  medias: {
    image: string;
    is_main: boolean;
  }[];
}

export const updatePortfolio = async (id: number, data: UpdatePortfolioRequest) => {
  const response = await api.put<Portfolio, UpdatePortfolioRequest>(`/api/portfolios/${id}/`, data);
  return response;
};

export const deletePortfolio = async (id: number) => {
  const response = await api.delete(`/api/portfolios/${id}/`);
  return response;
};
