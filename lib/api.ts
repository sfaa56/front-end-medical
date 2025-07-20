import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }, 
   withCredentials: true,
 
});

export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const putData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};


export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};


export const patchData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error patching data:', error);
    throw error;
  }
};


export const getDataWithParams = async (endpoint: string, params: any) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data with params:', error);
    throw error;
  }
};


export const postDataWithParams = async (endpoint: string, data: any, params: any) => {
  try {
    const response = await apiClient.post(endpoint, data, { params });
    return response.data;
  } catch (error) {
    console.error('Error posting data with params:', error);
    throw error;
  }
};



export const putDataWithParams = async (endpoint: string, data: any, params: any) => {
  try {
    const response = await apiClient.put(endpoint, data, { params });
    return response.data;
  } catch (error) {
    console.error('Error updating data with params:', error);
    throw error;
  }
};


export const deleteDataWithParams = async (endpoint: string, params: any) => {
  try {
    const response = await apiClient.delete(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('Error deleting data with params:', error);
    throw error;
  }
};


export const patchDataWithParams = async (endpoint: string, data: any, params: any) => {
  try {
    const response = await apiClient.patch(endpoint, data, { params });
    return response.data;
  } catch (error) {
    console.error('Error patching data with params:', error);
    throw error;
  }
};



export const uploadFile = async (endpoint: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const downloadFile = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint, {
      responseType: 'blob', // Important for file downloads
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};


