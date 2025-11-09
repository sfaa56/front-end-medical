import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpecialty = async () => {
      setLoading(true);
      try {
        const response = await apiClient("/specialties");
        if (response.status === 200) {
          setSpecialties(response.data);
        }
      } catch {
        toast.error("Error fetching specialties");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialty();
  }, []);

  const getSubSpecialties = (specialtyName: string) => {
    const specialtyObj = specialties.find((c) => c.name === specialtyName);
    return specialtyObj?.subSpecialties || [];
  };

    const getsubSpecialties = (specialtyId: string) => {
    const specialty = specialties.find((s) => s._id === specialtyId);
    return specialty?.subSpecialties || [];
  };

  return {
    specialties,
    loading,
    getSubSpecialties,
    getsubSpecialties
  };
}
