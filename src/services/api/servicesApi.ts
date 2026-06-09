import { api } from "@/api/axiosInstance";
import type { Service } from "@/data/servicesData";

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  total: number;
  current_page: number;
  last_page: number;
  stats: {
    total: number;
    published: number;
    pending: number;
    draft: number;
  };
}

export const servicesApi = {
  getAllServices: async (params?: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
  }): Promise<ServicesResponse> => {
    const response = await api.get("/api/v1/admin/services", { params });
    return response.data;
  },

  createService: async (data: Partial<Service>): Promise<{ success: boolean; data: Service }> => {
    const response = await api.post("/api/v1/admin/services", data);
    return response.data;
  },

  updateService: async (id: string | number, data: Partial<Service>): Promise<{ success: boolean; data: Service }> => {
    const response = await api.put(`/api/v1/admin/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string | number): Promise<{ success: boolean }> => {
    const response = await api.delete(`/api/v1/admin/services/${id}`);
    return response.data;
  },

  toggleFeatured: async (id: string | number): Promise<{ success: boolean; data: Service }> => {
    const response = await api.patch(`/api/v1/admin/services/${id}/toggle-featured`);
    return response.data;
  },

  toggleStatus: async (id: string | number): Promise<{ success: boolean; data: Service }> => {
    const response = await api.patch(`/api/v1/admin/services/${id}/toggle-status`);
    return response.data;
  },
};
