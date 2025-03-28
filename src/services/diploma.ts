interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const LOCAL_STORAGE_KEYS = {
  DIPLOMA_BOOKS: 'diploma_books',
  GRADUATION_DECISIONS: 'graduation_decisions',
  DIPLOMA_FORM_FIELDS: 'diploma_form_fields',
  DIPLOMA_INFOS: 'diploma_infos',
};

// Hàm lấy dữ liệu từ localStorage
const getLocalData = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Hàm lưu dữ liệu vào localStorage
const setLocalData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// 📌 **Diploma Book APIs**
export function getDiplomaBooks(): ApiResponse<any[]> {
  return { data: getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_BOOKS), status: 200 };
}

export function createDiplomaBook(year: number): ApiResponse<any> {
  const books = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_BOOKS);
  const newBook = { id: Date.now().toString(), year };
  books.push(newBook);
  setLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_BOOKS, books);
  return { data: newBook, status: 201 };
}

export function getDiplomaBook(id: string): ApiResponse<any> {
  const books = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_BOOKS);
  const book = books.find((b: any) => b.id === id);
  return book ? { data: book, status: 200 } : { data: null, status: 404, message: 'Not found' };
}

// 📌 **Graduation Decision APIs**
export function getGraduationDecisions(): ApiResponse<any[]> {
  return { data: getLocalData(LOCAL_STORAGE_KEYS.GRADUATION_DECISIONS), status: 200 };
}

export function createGraduationDecision(data: any): ApiResponse<any> {
  const decisions = getLocalData(LOCAL_STORAGE_KEYS.GRADUATION_DECISIONS);
  const newDecision = { id: Date.now().toString(), ...data };
  decisions.push(newDecision);
  setLocalData(LOCAL_STORAGE_KEYS.GRADUATION_DECISIONS, decisions);
  return { data: newDecision, status: 201 };
}

// 📌 **Diploma Form Field APIs**
export function getDiplomaFormFields(): ApiResponse<any[]> {
  return { data: getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_FORM_FIELDS), status: 200 };
}

export function createDiplomaFormField(data: any): ApiResponse<any> {
  const fields = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_FORM_FIELDS);
  const newField = { id: Date.now().toString(), ...data };
  fields.push(newField);
  setLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_FORM_FIELDS, fields);
  return { data: newField, status: 201 };
}

// 📌 **Diploma Info APIs**
export function getDiplomaInfos(): ApiResponse<any[]> {
  return { data: getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS), status: 200 };
}

export function createDiplomaInfo(data: any): ApiResponse<any> {
  const infos = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS);
  const newInfo = { id: Date.now().toString(), ...data };
  infos.push(newInfo);
  setLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS, infos);
  return { data: newInfo, status: 201 };
}

export function searchDiplomaInfo(params: any): ApiResponse<any[]> {
  const infos = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS);
  const filtered = infos.filter((info: any) =>
    Object.keys(params).every((key) => params[key] === undefined || info[key] === params[key])
  );
  return { data: filtered, status: 200 };
}

// 📌 **HÀM XÓA VĂN BẰNG**
export function deleteDiplomaInfo(id: string): ApiResponse<null> {
  const infos = getLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS);
  const updatedInfos = infos.filter((info: any) => info.id !== id);
  setLocalData(LOCAL_STORAGE_KEYS.DIPLOMA_INFOS, updatedInfos);
  return { data: null, status: 200 };
}
