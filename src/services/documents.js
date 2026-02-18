import api from './api';

const DOCUMENTS_ENDPOINT = '/documents';

/**
 * Fetch all documents with filtering, sorting, and pagination
 */
export const fetchDocuments = async (params = {}) => {
  try {
    // Add allCampuses=true by default to see all documents
    const defaultParams = { allCampuses: 'true', ...params };
    let url = DOCUMENTS_ENDPOINT;
    const queryArray = Object.entries(defaultParams)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => {
        // If value is an object, stringify it (shouldn't happen but safe)
        const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `${encodeURIComponent(key)}=${encodeURIComponent(strValue)}`;
      });
    
    if (queryArray.length > 0) {
      url += '?' + queryArray.join('&');
    }
    
    console.log('🔗 Request URL:', url);
    const response = await api.get(url);
    console.log('📥 Fetched documents:', response.data);
    return response.data?.data?.documents || response.data?.data || [];
  } catch (error) {
    console.error('❌ Error fetching documents:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Get single document by ID
 */
export const fetchDocumentById = async (id) => {
  try {
    const response = await api.get(`${DOCUMENTS_ENDPOINT}/${id}`);
    return response.data?.data?.document || response.data?.data;
  } catch (error) {
    console.error('❌ Error fetching document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create a new document (with file upload)
 * Accepts FormData with: file, title, description, category, faculty, department, etc.
 */
export const createDocument = async (formData) => {
  try {
    console.log('📤 Creating document with FormData');
    const response = await api.post(DOCUMENTS_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Document created:', response.data);
    return response.data?.data?.document || response.data?.data;
  } catch (error) {
    console.error('❌ Error creating document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update document (metadata only, no file replacement)
 */
export const updateDocument = async (id, updates) => {
  try {
    console.log('📤 Updating document:', id);
    const response = await api.patch(`${DOCUMENTS_ENDPOINT}/${id}`, updates);
    return response.data?.data?.document || response.data?.data;
  } catch (error) {
    console.error('❌ Error updating document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (id) => {
  try {
    console.log('🗑️ Deleting document:', id);
    const response = await api.delete(`${DOCUMENTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Search documents
 */
export const searchDocuments = async (query, filters = {}) => {
  try {
    const params = { search: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`${DOCUMENTS_ENDPOINT}/search?${queryString}`);
    return response.data?.data?.documents || [];
  } catch (error) {
    console.error('❌ Error searching documents:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get documents by faculty
 */
export const getDocumentsByFaculty = async (facultyId, page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `${DOCUMENTS_ENDPOINT}/faculty/${facultyId}?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error('❌ Error fetching documents by faculty:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get documents by department
 */
export const getDocumentsByDepartment = async (departmentId, page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `${DOCUMENTS_ENDPOINT}/department/${departmentId}?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error('❌ Error fetching documents by department:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get documents by course
 */
export const getDocumentsByCourse = async (courseCode, page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `${DOCUMENTS_ENDPOINT}/course/${courseCode}?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error('❌ Error fetching documents by course:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get trending documents
 */
export const getTrendingDocuments = async (limit = 10) => {
  try {
    const response = await api.get(`${DOCUMENTS_ENDPOINT}/trending?limit=${limit}`);
    return response.data?.data?.documents || [];
  } catch (error) {
    console.error('❌ Error fetching trending:', error);
    throw error.response?.data || error;
  }
};

/**
 * Download a document (increment download counter)
 */
export const downloadDocument = async (id) => {
  try {
    const response = await api.get(`${DOCUMENTS_ENDPOINT}/${id}/download`);
    return response.data?.data?.downloadUrl;
  } catch (error) {
    console.error('❌ Error downloading document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Add rating to document
 */
export const rateDocument = async (id, rating) => {
  try {
    const response = await api.post(`${DOCUMENTS_ENDPOINT}/${id}/rate`, { rating });
    return response.data?.data?.document;
  } catch (error) {
    console.error('❌ Error rating document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Add comment to document
 */
export const commentDocument = async (id, comment) => {
  try {
    const response = await api.post(`${DOCUMENTS_ENDPOINT}/${id}/comments`, { text: comment });
    return response.data?.data?.comment;
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    throw error.response?.data || error;
  }
};

export default {
  fetchDocuments,
  fetchDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  searchDocuments,
  getDocumentsByFaculty,
  getDocumentsByDepartment,
  getDocumentsByCourse,
  getTrendingDocuments,
  downloadDocument,
  rateDocument,
  commentDocument,
};

