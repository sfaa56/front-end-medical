import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoy = async () => {
      setLoading(true);

      try {
        const response = await apiClient("categories");

        setCategories(response.data || []);
      } catch (error) {
        toast.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoy();
  }, []);

  return {
    setCategories,
    categories,
    loading,
  };
}
