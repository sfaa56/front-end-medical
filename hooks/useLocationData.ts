import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function useLocationData() {
  const [cities, setCities] = useState<any[]>([]);
  const [loadingLocation, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await apiClient("/cities");
        if (response.status === 200) {
          setCities(response.data);
        }
      } catch {
        toast.error("Error fetching cities");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const getDistricts = (cityName: string) => {
    const cityObj = cities.find((c) => c.name === cityName);
    return cityObj?.districts || [];
  };

  const getPostalCodes = (cityName: string, districtName: string) => {
    const cityObj = cities.find((c) => c.name === cityName);
    const districts = cityObj?.districts || [];
    const districtObj = districts.find((d) => d.name === districtName);
    return districtObj?.postalCodes || [];
  };

  return {
    cities,
    loadingLocation,
    getDistricts,
    getPostalCodes,
  };
}
