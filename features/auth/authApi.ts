import { apiClient } from "@/lib/api";
import { registerSchema, User, UserRegisterResponse } from "../../types/user";
import axios from "axios";


export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdatePayload {
  name?:string,
  email?:string,
  phoneNumber?:string,
  role?:string,
  id?:string
}

interface userReturnRequest {
    user: User;
    token: string;
}

export interface changePasswordPayload{
  oldPassword:string;
  newPassword:string;
  confirmPassword:string;
}

export interface picture{
  imageUrl:string,
  publicId:string
}

export const login = async (data: LoginPayload): Promise<userReturnRequest> => {
  //  const response = await apiClient.post('/auth/login', data, { withCredentials: true });
   const response = await axios.post('/api/login', data, { withCredentials: true });

  return response.data;
};

export const logout = async ()=>{
  await axios.post("/api/auth/logout",{});
}

export const update = async (data: UpdatePayload): Promise<User> => {
  const response = await axios.put(`/api/users/${data.id}`, data,{ withCredentials: true });
  return response.data;
}

export const changePassword = async (data:changePasswordPayload):Promise<string>=>{
  const response = await axios.put("/api/auth/password",data,{ withCredentials: true });
  console.log("response in authApi",response.data)
  return response.data
}

export const picture = async (data:picture):Promise<User>=>{
  const response = await axios.put("/api/users/picture/upload",data,{ withCredentials: true });
  return response.data.user
}

export interface RegisterPayload {
  confirmPassword: string;
  location: { postalCode: string };
  [key: string]: any;
}

export const register = async (payload: RegisterPayload): Promise<UserRegisterResponse> => {
    const { confirmPassword, location, ...rest } = payload;

    const cleanData = {
        ...rest,
        postalCode: location.postalCode
    };

    const response = await apiClient.post('/auth/register', cleanData);
    return response.data;
}