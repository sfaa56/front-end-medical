import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export const updateCategories = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await apiClient.put(`categories/${data.id}`, data);
    toast.success("category updated successfully");
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

export const addingCategory = async (data, setLoading) => {
  try {
    setLoading(true);
    const response = await apiClient.post("categories", data);
    toast.success("category added successfully");
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

export const deleteCategory = async (id, setLoading) => {
  try {
    setLoading(true);
    const response = await apiClient.delete(`categories/${id}`);
    toast.success("Category deleted successfullty");
    return response.data;
  } catch (error:any) {
    console.log('error',error)
    toast.error(error.response.data.message);
  } finally {
    setLoading(false);
  }
};
