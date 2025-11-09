import { apiClient } from "@/lib/api";
import axios from "axios";

export const picture = async (data:any)=>{
  const response = await apiClient.put("/users/pictureFromAdmin/upload",data,{ withCredentials: true });
  return response.data.user
}

export const fetchUsers = async (query:any) => {
  const response = await apiClient.get(`/users?${query.toString()}`,{withCredentials:true});
  return response.data;
}


export const deleteUser = async (userId: string, reason?: string) => {
  const response = await axios.delete(`/api/users/${userId}`, {
     data: reason ? { reason } : {},
    withCredentials: true,
  });
  return response.data;
};

export const approveUser = async (userId: string) => {
  const response = await axios.put(`/api/admin/approve-provider/${userId}`,  { withCredentials: true });
  return response.data;
}


export const blockUser = async (userId: string) => {
  const response = await apiClient.put(`/users/${userId}/block`);
  return response.data;
}

export const unblockUser = async (userId: string) => {
  const response = await apiClient.put(`/users/${userId}/unblock`);
  return response.data;
}



export const getUserById = async (userId: string) => {
  console.log("api cinent",apiClient.defaults.baseURL)
  const response = await apiClient.get(`/users/${userId}`); 
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await axios.put(`/api/users/${userId}`, userData, { withCredentials: true });
  return response.data;
}


