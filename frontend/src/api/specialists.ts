import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Specialist API endpoints
export const specialistApi = {
  // Get all specialists with filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'drafts' | 'published';
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => {
    const response = await apiClient.get('/api/specialists', { params });
    return response.data;
  },

  // Get single specialist by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/specialists/${id}`);
    return response.data;
  },

  // Create new specialist
  create: async (data: {
    title: string;
    description?: string;
    base_price: number;
    duration_days: number;
    is_draft?: boolean;
    service_offerings?: string[];
  }) => {
    const response = await apiClient.post('/api/specialists', data);
    return response.data;
  },

  // Update specialist
  update: async (id: string, data: Partial<{
    title: string;
    description?: string;
    base_price: number;
    duration_days: number;
    is_draft?: boolean;
    service_offerings?: string[];
  }>) => {
    const response = await apiClient.put(`/api/specialists/${id}`, data);
    return response.data;
  },

  // Delete specialist
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/specialists/${id}`);
    return response.data;
  },

  // Publish specialist
  publish: async (id: string) => {
    const response = await apiClient.patch(`/api/specialists/${id}/publish`);
    return response.data;
  },

  // Upload media
  uploadMedia: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await apiClient.post(`/api/specialists/${id}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete media
  deleteMedia: async (id: string, mediaId: string) => {
    const response = await apiClient.delete(`/api/specialists/${id}/media/${mediaId}`);
    return response.data;
  },
};

// Service Offerings Master List API
export const serviceOfferingsApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/service-offerings-master');
    return response.data;
  },
};

export default apiClient;
