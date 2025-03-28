import { useState, useCallback, useEffect } from "react";
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
  deleteDiplomaInfo as deleteDiplomaInfoService, // Thêm API xóa văn bằng
} from "@/services/diploma";

// 📝 Định nghĩa kiểu dữ liệu
export type DataType = "String" | "Number" | "Date";

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
  studentId: string;
  fullName: string;
  ethnicity: string;
  placeOfBirth: string;
  admissionDate: string;
  averageRank: number;
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

// 📌 Hook quản lý dữ liệu văn bằng
export default function useDiplomaModel() {
  const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>([]);
  const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>([]);
  const [diplomaFormFields, setDiplomaFormFields] = useState<DiplomaFormField[]>([]);
  const [diplomaInfos, setDiplomaInfos] = useState<DiplomaInfo[]>([]);

  // 🛠 Load dữ liệu ban đầu
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
      } catch {
        console.error("⚠️ Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, []);

  // 📌 Thêm sổ văn bằng
  const createDiplomaBook = useCallback(async (year: number) => {
    const response: ApiResponse<DiplomaBook> = await createDiplomaBookService(year);
    if (response.data) {
      setDiplomaBooks((prev) => [...prev, response.data]);
      return response.data;
    }
    throw new Error(response.message || "Không thể tạo sổ văn bằng");
  }, []);

  // 📌 Thêm quyết định tốt nghiệp
  const createGraduationDecision = useCallback(async (decision: Omit<GraduationDecision, "id" | "createdAt" | "updatedAt">) => {
    const response: ApiResponse<GraduationDecision> = await createGraduationDecisionService(decision);
    if (response.data) {
      setGraduationDecisions((prev) => [...prev, response.data]);
      return response.data;
    }
    throw new Error(response.message || "Không thể tạo quyết định tốt nghiệp");
  }, []);

  // 📌 Thêm trường thông tin văn bằng
  const createDiplomaFormField = useCallback(async (field: Omit<DiplomaFormField, "id">) => {
    const response: ApiResponse<DiplomaFormField> = await createDiplomaFormFieldService(field);
    if (response.data) {
      setDiplomaFormFields((prev) => [...prev, response.data]);
      return response.data;
    }
    throw new Error(response.message || "Không thể tạo trường thông tin");
  }, []);

  // 📌 Cập nhật trường thông tin
  const updateDiplomaFormField = useCallback(async (field: DiplomaFormField) => {
    const response: ApiResponse<DiplomaFormField> = await updateDiplomaFormFieldService(field);
    if (response.data) {
      setDiplomaFormFields((prev) =>
        prev.map((item) => (item.id === field.id ? response.data : item))
      );
      return response.data;
    }
    throw new Error(response.message || "Không thể cập nhật trường thông tin");
  }, []);

  // 📌 Xóa trường thông tin
  const deleteDiplomaFormField = useCallback(async (id: string) => {
    await deleteDiplomaFormFieldService(id);
    setDiplomaFormFields((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 📌 Thêm văn bằng
  const createDiplomaInfo = useCallback(async (data: Omit<DiplomaInfo, "id" | "createdAt" | "updatedAt">) => {
    const response: ApiResponse<DiplomaInfo> = await createDiplomaInfoService(data);
    if (response.data) {
      setDiplomaInfos((prev) => [...prev, response.data]);
      return response.data;
    }
    throw new Error(response.message || "Không thể tạo văn bằng");
  }, []);

  // 📌 Tìm kiếm văn bằng
  const searchDiplomaInfo = useCallback(async (query: Partial<DiplomaInfo>) => {
    const response: ApiResponse<DiplomaInfo[]> = await searchDiplomaInfoService(query);
    setDiplomaInfos(response.data);
  }, []);

  // 📌 Xóa văn bằng
  const removeDiploma = useCallback(async (id: string) => {
    try {
      await deleteDiplomaInfoService(id);
      setDiplomaInfos((prev) => prev.filter((item) => item.id !== id));
    } catch {
      console.error("⚠️ Lỗi khi xóa văn bằng");
    }
  }, []);

  return {
    diplomaBooks,
    graduationDecisions,
    diplomaFormFields,
    diplomaInfos,
    createDiplomaBook,
    createGraduationDecision,
    createDiplomaFormField,
    updateDiplomaFormField,
    deleteDiplomaFormField,
    createDiplomaInfo,
    searchDiplomaInfo,
    removeDiploma,
  };
}
