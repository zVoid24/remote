export interface Specialist {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  base_price: number;
  platform_fee: number;
  final_price: number;
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  is_verified: boolean;
  is_draft: boolean;
  duration_days: number;
  average_rating: number;
  total_number_of_ratings: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  serviceOfferings?: ServiceOffering[];
  media?: Media[];
}

export interface ServiceOffering {
  id: string;
  specialist_id: string;
  service_id: string;
  service_offerings_master_list_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  serviceOfferingMaster?: ServiceOfferingMasterList;
}

export interface ServiceOfferingMasterList {
  id: string;
  title: string;
  description: string | null;
  bucket_name: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  specialist_id: string;
  tier_name: string;
  file_name: string;
  file_size: number;
  display_order: number;
  mime_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  media_type: 'image' | 'video' | 'document';
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type FilterTab = 'all' | 'drafts' | 'published';

