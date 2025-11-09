import { apiClient } from "@/lib/api";


// 🟢 Create new service request
export const createServiceRequest = async (data: any) => {
  const res = await apiClient.post("/serviceRequest", data);
  return res.data;
};

// 🟢 Get all service requests (public)
export const getAllServiceRequests = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/serviceRequest?${query}`);

  return res.data;
};

// 🟢 Get single service request by ID
export const getServiceRequestById = async (id: string) => {
  const res = await apiClient.get(`/serviceRequest/${id}`);
  return res.data;
};

// 🟢 Get all requests by specific client ID (needs token)
export const getRequestsByClientId = async (clientId: string) => {
  const res = await apiClient.get(`/serviceRequest/client/${clientId}`);
  return res.data;
};

// 🟡 Update service request (partial update recommended)
export const updateServiceRequest = async (id: string, updatedData: any) => {
  const res = await apiClient.put(`/serviceRequest/${id}`, updatedData);
  return res.data;
};

// 🔴 Delete service request
export const deleteServiceRequest = async (id: string) => {
  const res = await apiClient.delete(`/serviceRequest/${id}`);
  return res.data;
};
