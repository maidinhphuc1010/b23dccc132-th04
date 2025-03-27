import { useState, useCallback, useEffect } from 'react';
import {
  getDiplomaBooks,
  createDiplomaBook as createDiplomaBookService,
  getGraduationDecisions,
  createGraduationDecision as createGraduationDecisionService,
  getDiplomaFormFields,
  createDiplomaFormField as createDiplomaFormFieldService,
  updateDiplomaFormField as updateDiplomaFormFieldService,
  deleteDiplomaFormField as deleteDiplomaFormFieldService,
  getDiplomaInfos,
  createDiplomaInfo as createDiplomaInfoService,
  searchDiplomaInfo as searchDiplomaInfoService,
} from '@/services/diploma';

// Types
export type DataType = 'String' | 'Number' | 'Date';

export interface DiplomaFormField {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  order: number;
}

export interface DiplomaBook {
  id: string;
  year: number;
  currentNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface GraduationDecision {
  id: string;
  number: string;
  issueDate: string;
  summary: string;
  diplomaBookId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiplomaInfo {
  id: string;
  bookNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  graduationDecisionId: string;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Model
export default function useDiplomaModel() {
  const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>([]);
  const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>([]);
  const [diplomaFormFields, setDiplomaFormFields] = useState<DiplomaFormField[]>([]);
  const [diplomaInfos, setDiplomaInfos] = useState<DiplomaInfo[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksRes, decisionsRes, fieldsRes, infosRes] = await Promise.all([
          getDiplomaBooks(),
          getGraduationDecisions(),
          getDiplomaFormFields(),
          getDiplomaInfos(),
        ]);
        setDiplomaBooks(booksRes.data);
        setGraduationDecisions(decisionsRes.data);
        setDiplomaFormFields(fieldsRes.data);
        setDiplomaInfos(infosRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Diploma Book operations
  const createDiplomaBook = useCallback(async (year: number): Promise<DiplomaBook> => {
    try {
      const response: ApiResponse<DiplomaBook> = await createDiplomaBookService(year);
      if (response.data) {
        setDiplomaBooks(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create diploma book');
    } catch (error) {
      console.error('Error creating diploma book:', error);
      throw error;
    }
  }, []);

  const getDiplomaBook = useCallback(async (id: string): Promise<DiplomaBook> => {
    try {
      const book = diplomaBooks.find(b => b.id === id);
      if (!book) {
        throw new Error('Diploma book not found');
      }
      return book;
    } catch (error) {
      console.error('Error getting diploma book:', error);
      throw error;
    }
  }, [diplomaBooks]);

  // Graduation Decision operations
  const createGraduationDecision = useCallback(async (decision: Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt'>): Promise<GraduationDecision> => {
    try {
      const response: ApiResponse<GraduationDecision> = await createGraduationDecisionService(decision);
      if (response.data) {
        setGraduationDecisions(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create graduation decision');
    } catch (error) {
      console.error('Error creating graduation decision:', error);
      throw error;
    }
  }, []);

  // Diploma Form Field operations
  const createDiplomaFormField = useCallback(async (field: Omit<DiplomaFormField, 'id'>): Promise<DiplomaFormField> => {
    try {
      const response: ApiResponse<DiplomaFormField> = await createDiplomaFormFieldService(field);
      if (response.data) {
        setDiplomaFormFields(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create diploma form field');
    } catch (error) {
      console.error('Error creating diploma form field:', error);
      throw error;
    }
  }, []);

  const updateDiplomaFormField = useCallback(async (id: string, field: Partial<DiplomaFormField>): Promise<DiplomaFormField> => {
    try {
      const response: ApiResponse<DiplomaFormField> = await updateDiplomaFormFieldService(id, field);
      if (response.data) {
        setDiplomaFormFields(prev => prev.map(f => f.id === id ? response.data : f));
        return response.data;
      }
      throw new Error(response.message || 'Failed to update diploma form field');
    } catch (error) {
      console.error('Error updating diploma form field:', error);
      throw error;
    }
  }, []);

  const deleteDiplomaFormField = useCallback(async (id: string): Promise<void> => {
    try {
      const response: ApiResponse<void> = await deleteDiplomaFormFieldService(id);
      if (response.status === 200) {
        setDiplomaFormFields(prev => prev.filter(f => f.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete diploma form field');
      }
    } catch (error) {
      console.error('Error deleting diploma form field:', error);
      throw error;
    }
  }, []);

  // Diploma Info operations
  const createDiplomaInfo = useCallback(async (info: Omit<DiplomaInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiplomaInfo> => {
    try {
      const response: ApiResponse<DiplomaInfo> = await createDiplomaInfoService(info);
      if (response.data) {
        setDiplomaInfos(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create diploma info');
    } catch (error) {
      console.error('Error creating diploma info:', error);
      throw error;
    }
  }, []);

  const searchDiplomaInfo = useCallback(async (params: {
    diplomaNumber?: string;
    bookNumber?: number;
    studentId?: string;
    fullName?: string;
    dateOfBirth?: string;
  }): Promise<DiplomaInfo[]> => {
    try {
      const response: ApiResponse<DiplomaInfo[]> = await searchDiplomaInfoService(params);
      return response.data;
    } catch (error) {
      console.error('Error searching diploma info:', error);
      throw error;
    }
  }, []);

  return {
    diplomaBooks,
    graduationDecisions,
    diplomaFormFields,
    diplomaInfos,
    createDiplomaBook,
    getDiplomaBook,
    createGraduationDecision,
    createDiplomaFormField,
    updateDiplomaFormField,
    deleteDiplomaFormField,
    createDiplomaInfo,
    searchDiplomaInfo,
  };
} 