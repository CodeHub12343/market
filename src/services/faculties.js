import api from './api';

const FACULTIES_ENDPOINT = '/faculties';
const DEPARTMENTS_ENDPOINT = '/departments';

/**
 * Fetch all faculties
 */
export const fetchFaculties = async () => {
  try {
    const response = await api.get(FACULTIES_ENDPOINT);
    console.log('📥 Fetched faculties:', response.data);
    return response.data?.data?.faculties || response.data?.data || [];
  } catch (error) {
    console.error('❌ Error fetching faculties:', error);
    throw error;
  }
};

/**
 * Fetch departments by faculty ID
 */
export const fetchDepartmentsByFaculty = async (facultyId) => {
  try {
    const response = await api.get(`${DEPARTMENTS_ENDPOINT}?faculty=${facultyId}`);
    console.log('📥 Fetched departments:', response.data);
    return response.data?.data?.departments || response.data?.data || [];
  } catch (error) {
    console.error('❌ Error fetching departments:', error);
    throw error;
  }
};

export default {
  fetchFaculties,
  fetchDepartmentsByFaculty,
};
