import { request } from 'umi';
import type { DiplomaBook, GraduationDecision, DiplomaFormField, DiplomaInfo } from '@/models/diploma';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An error occurred while making the request');
};

// Diploma Book APIs
export async function getDiplomaBooks(): Promise<ApiResponse<DiplomaBook[]>> {
  try {
    const response = await request<ApiResponse<DiplomaBook[]>>('/api/diploma/books');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createDiplomaBook(year: number): Promise<ApiResponse<DiplomaBook>> {
  try {
    const response = await request<ApiResponse<DiplomaBook>>('/api/diploma/books', {
      method: 'POST',
      data: { year },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getDiplomaBook(id: string): Promise<ApiResponse<DiplomaBook>> {
  try {
    const response = await request<ApiResponse<DiplomaBook>>(`/api/diploma/books/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// Graduation Decision APIs
export async function getGraduationDecisions(): Promise<ApiResponse<GraduationDecision[]>> {
  try {
    const response = await request<ApiResponse<GraduationDecision[]>>('/api/diploma/decisions');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createGraduationDecision(data: Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<GraduationDecision>> {
  try {
    const response = await request<ApiResponse<GraduationDecision>>('/api/diploma/decisions', {
      method: 'POST',
      data,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getGraduationDecision(id: string): Promise<ApiResponse<GraduationDecision>> {
  try {
    const response = await request<ApiResponse<GraduationDecision>>(`/api/diploma/decisions/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// Diploma Form Field APIs
export async function getDiplomaFormFields(): Promise<ApiResponse<DiplomaFormField[]>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField[]>>('/api/diploma/form-fields');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createDiplomaFormField(data: Omit<DiplomaFormField, 'id'>): Promise<ApiResponse<DiplomaFormField>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField>>('/api/diploma/form-fields', {
      method: 'POST',
      data,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateDiplomaFormField(id: string, data: Partial<DiplomaFormField>): Promise<ApiResponse<DiplomaFormField>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField>>(`/api/diploma/form-fields/${id}`, {
      method: 'PUT',
      data,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteDiplomaFormField(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await request<ApiResponse<void>>(`/api/diploma/form-fields/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// Diploma Info APIs
export async function getDiplomaInfos(): Promise<ApiResponse<DiplomaInfo[]>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo[]>>('/api/diploma/infos');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createDiplomaInfo(data: Omit<DiplomaInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<DiplomaInfo>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo>>('/api/diploma/infos', {
      method: 'POST',
      data,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getDiplomaInfo(id: string): Promise<ApiResponse<DiplomaInfo>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo>>(`/api/diploma/infos/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function searchDiplomaInfo(params: {
  diplomaNumber?: string;
  bookNumber?: number;
  studentId?: string;
  fullName?: string;
  dateOfBirth?: string;
}): Promise<ApiResponse<DiplomaInfo[]>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo[]>>('/api/diploma/infos/search', {
      method: 'GET',
      params,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
} 