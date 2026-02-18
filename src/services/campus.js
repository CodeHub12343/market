import api from "./api";

export const getCampuses = async () => {
  try {
    // Try the /campus endpoint first
    console.log('getCampuses: Trying /campus endpoint');
    const response = await api.get("/campus");
    console.log('getCampuses /campus response:', response.data);
    return response;
  } catch (error) {
    console.warn('getCampuses /campus endpoint failed:', error.message);
    // If /campus fails, try /categories endpoint
    try {
      console.log('getCampuses: Falling back to /categories endpoint');
      const response = await api.get("/categories");
      console.log('getCampuses /categories response:', response.data);
      return response;
    } catch (err) {
      console.error('getCampuses: Both endpoints failed');
      throw err;
    }
  }
};

export const getCampusById = (id) => api.get(`/campus/${id}`);
