"use client";
import React, { useEffect, useState } from "react";
import { City, District, PostalCode } from "@/types/cities";
import StatusBadge from "@/components/StatusBadge";
import ActionButton from "@/components/ActionButton";
import CityForm from "@/components/cities/CityForm";
import DistrictForm from "@/components/cities/DistrictForm";
import PostalCodeForm from "@/components/cities/PostalCodeForm";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

interface districtFormProps {
  name: string;
  postalCodes: PostalCode[];
  active: boolean;
}

function Page() {
  // State
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [selectedCityIdx, setSelectedCityIdx] = useState<number | null>(null);
  const [selectedDistrictIdx, setSelectedDistrictIdx] = useState<number | null>(
    null
  );

  // City form
  const [cityForm, setCityForm] = useState<{
    name: string;
    districts: districtFormProps[];
    newDistrict: string;
  }>({
    name: "",
    districts: [],
    newDistrict: "",
  });
  const [editingCityIdx, setEditingCityIdx] = useState<number | null>(null);

  // District form
  const [districtForm, setDistrictForm] = useState({ name: "" });
  const [editingDistrictIdx, setEditingDistrictIdx] = useState<number | null>(
    null
  );
  const [districtPostalCodes, setDistrictPostalCodes] = useState<string[]>([]);
  const [newDistrictPostal, setNewDistrictPostal] = useState("");

  // Postal code form
  const [postalForm, setPostalForm] = useState({ code: "" });
  const [editingPostalIdx, setEditingPostalIdx] = useState<number | null>(null);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await apiClient("/cities");
        if (response.status === 200) {
          setCities(response.data);
        }
      } catch (error) {
        toast.error("Error fetching cities");
      }
      setLoadingCities(false);
    };
    fetchCities();
  }, []);

  // Cities
  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.name.trim()) return;

    setFormLoading(true);
    try {
      if (editingCityIdx !== null) {
        // Update existing city
        const cityId = cities[editingCityIdx]._id;
        const response = await axios.put(
          `/api/cities/${cityId}`,
          {
            name: cityForm.name,
            districts: cityForm.districts.map((d) => ({
              name: d.name,
              active: true,
              postalCodes: d.postalCodes.map((code) => ({
                code: code.code,
                active: true,
              })),
            })),
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setCities((prev) =>
            prev.map((c, idx) =>
              idx === editingCityIdx
                ? { ...c, name: cityForm.name, districts: cityForm.districts }
                : c
            )
          );
          toast.success("City updated successfully");
        }
      } else {
        // Add new city
        const response = await axios.post("/api/cities", {
          name: cityForm.name,
          districts: cityForm.districts.map((d) => ({
            name: d.name,
            active: true,
            postalCodes: d.postalCodes.map((code) => ({
              code: code.code,
              active: true,
            })),
          })),
        },
      {withCredentials:true}
      );
        if (response.status === 201) {
          setCities((prev) => [...prev, response.data]);
          toast.success("City added successfully");
        }
      }
    } catch (error) {
      toast.error("Error saving city");
    }
    setCityForm({ name: "", districts: [], newDistrict: "" });
    setEditingCityIdx(null);
    setFormLoading(false);
  };

  const startCityEdit = (idx: number) => {
    setCityForm({
      name: cities[idx].name,
      districts: cities[idx].districts.map((d) => ({
        ...d,
        newPostalCode: null,
      })),
      newDistrict: "",
    });
    setEditingCityIdx(idx);
  };

  const handleDeleteCity = async (idx: number) => {
    try {
      const CityId = cities[idx]._id;
      const response = await axios.delete(`/api/cities/${CityId}`, { withCredentials: true });
      if (response.status === 200) {
        setCities((prev) => prev.filter((_, i) => i !== idx));
        toast.success("City deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting city");
    }
    setEditingCityIdx(null);
    setCityForm({ name: "", districts: [], newDistrict: "" });
  };

  const handleToggleCityActive = async (idx: number) => {
    try {
      const cityId = cities[idx]._id;
      const city = cities[idx];
      const response = await axios.put(`/api/cities/${cityId}`, {
        name: city.name,
        active: !city.active,
        districts: city.districts,
      });
      if (response.status === 200) {
        setCities((prev) =>
          prev.map((c, i) => (i === idx ? { ...c, active: !c.active } : c))
        );
        toast.success(`City ${city.active ? "deactivated" : "activated"}`);
      }
    } catch (error) {
      toast.error("Error toggling city status");
    }
  };

  // Districts
  const handleDistrictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCityIdx === null || !districtForm.name.trim()) return;

    setFormLoading(true);
    const cityId = cities[selectedCityIdx]._id;
    const districtId =
      cities[selectedCityIdx].districts[editingDistrictIdx || 0]?._id;
    try {
      if (editingDistrictIdx !== null) {
        // Update existing district
        const response = await axios.put(
          `/api/cities/${cityId}/districts/${districtId}`,
          {
            name: districtForm.name,
            active: true,
            postalCodes: districtPostalCodes.map((code) => ({
              code,
              active: true,
            })),
          },
          {withCredentials:true}
        );
        if (response.status === 201) {
          setCities((prev) =>
            prev.map((city, cIdx) =>
              cIdx === selectedCityIdx
                ? {
                    ...city,
                    districts: city.districts.map((d, dIdx) =>
                      dIdx === editingDistrictIdx
                        ? {
                            ...d,
                            active: true,
                            name: districtForm.name,
                            postalCodes: districtPostalCodes.map((code) => ({
                              code,
                              active: true,
                            })),
                          }
                        : d
                    ),
                  }
                : city
            )
          );
          toast.success("District updated successfully");
        }
      } else {
        // Add new district
        const response = await axios.post(`/api/cities/${cityId}/districts`, {
          name: districtForm.name,
          active: true,
          postalCodes: districtPostalCodes.map((code) => ({
            code,
            active: true,
          })),
        },
      {withCredentials:true}
      );
        if (response.status === 201) {
          setCities((prev) =>
            prev.map((city, cIdx) =>
              cIdx === selectedCityIdx
                ? {
                    ...city,
                    districts: [
                      ...city.districts,
                      response.data, // Use the response data for the new district
                    ],
                  }
                : city
            )
          );
          toast.success("District added successfully");
        }
      }
    } catch (error) {
      toast.error("Error saving district");
    }
    setDistrictForm({ name: "" });
    setDistrictPostalCodes([]);
    setNewDistrictPostal("");
    setEditingDistrictIdx(null);
    setFormLoading(false);
  };

  const startDistrictEdit = (idx: number) => {
    if (selectedCityIdx === null) return;
    const district = cities[selectedCityIdx].districts[idx];
    setDistrictForm({ name: district.name });
    setDistrictPostalCodes(district.postalCodes.map((p) => p.code));
    setNewDistrictPostal("");
    setEditingDistrictIdx(idx);
  };

  const handleDeleteDistrict = async (idx: number) => {
    if (selectedCityIdx === null) return;

    const cityId = cities[selectedCityIdx]._id;
    const districtId = cities[selectedCityIdx].districts[idx]._id;
    try {
      const response = await axios.delete(
        `/api/cities/${cityId}/districts/${districtId}`,{withCredentials:true}
      );
      if (response.status === 200) {
        setCities((prev) =>
          prev.map((city, cIdx) =>
            cIdx === selectedCityIdx
              ? {
                  ...city,
                  districts: city.districts.filter((_, dIdx) => dIdx !== idx),
                }
              : city
          )
        );
        toast.success("District deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting district");
    }
    setEditingDistrictIdx(null);
    setDistrictForm({ name: "" });
    setDistrictPostalCodes([]);
    setNewDistrictPostal("");
  };

  const handleToggleDistrictActive = async (idx: number) => {
    if (selectedCityIdx === null) return;

    const cityId = cities[selectedCityIdx]._id;
    const district = cities[selectedCityIdx].districts[idx];
    const districtId = cities[selectedCityIdx].districts[idx || 0]?._id;

    try {
      const response = await axios.put(
        `/api/cities/${cityId}/districts/${districtId}`,
        {
          name: district.name,
          active: !district.active,
          postalCodes: district.postalCodes,
        },
        {withCredentials:true}
      );
      if (response.status === 201) {
        setCities((prev) =>
          prev.map((city, cIdx) =>
            cIdx === selectedCityIdx
              ? {
                  ...city,
                  districts: city.districts.map((d, dIdx) =>
                    dIdx === idx ? { ...d, active: !d.active } : d
                  ),
                }
              : city
          )
        );
        toast.success(
          `District ${district.active ? "deactivated" : "activated"}`
        );
      }
    } catch (error) {
      toast.error("Error toggling district status");
    }
  };

  // Postal codes
  const handlePostalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedCityIdx === null ||
      selectedDistrictIdx === null ||
      !postalForm.code.trim()
    )
      return;

    setFormLoading(true);
    const cityId = cities[selectedCityIdx]._id;
    const districtIdx = selectedDistrictIdx;
    const districtId =
      cities[selectedCityIdx].districts[selectedDistrictIdx]?._id;
    const postalCodeId =
      cities[selectedCityIdx].districts[selectedDistrictIdx].postalCodes[
        editingPostalIdx || 0
      ]?._id;

    try {
      if (editingPostalIdx !== null) {
        // Update postal code
        const response = await axios.put(
          `/api/cities/${cityId}/districts/${districtId}/postalCodes/${postalCodeId}`,
          {
            code: postalForm.code,
            active: true,
          },{withCredentials:true}
        );
        if (response.status === 200) {
          setCities((prev) =>
            prev.map((city, cIdx) =>
              cIdx === selectedCityIdx
                ? {
                    ...city,
                    districts: city.districts.map((district, dIdx) =>
                      dIdx === selectedDistrictIdx
                        ? {
                            ...district,
                            postalCodes: district.postalCodes.map((p, pIdx) =>
                              pIdx === editingPostalIdx
                                ? { ...p, code: postalForm.code, active: true }
                                : p
                            ),
                          }
                        : district
                    ),
                  }
                : city
            )
          );
          toast.success("Postal code updated successfully");
        }
        setEditingPostalIdx(null);
      } else {
        // Add new postal code
        const response = await axios.post(
          `/api/cities/${cityId}/districts/${districtId}/postalCodes`,
          {
            code: postalForm.code,
            active: true,
          },
          {withCredentials:true}
        );
        if (response.status === 201) {
          setCities((prev) =>
            prev.map((city, cIdx) =>
              cIdx === selectedCityIdx
                ? {
                    ...city,
                    districts: city.districts.map((district, dIdx) =>
                      dIdx === selectedDistrictIdx
                        ? {
                            ...district,
                            postalCodes: [
                              ...district.postalCodes,
                              response.data,
                            ],
                          }
                        : district
                    ),
                  }
                : city
            )
          );
          toast.success("Postal code added successfully");
        }
      }
    } catch (error) {
      toast.error("Error saving postal code");
    }
    setPostalForm({ code: "" });
    setFormLoading(false);
  };

  const startPostalEdit = (idx: number) => {
    if (selectedCityIdx === null || selectedDistrictIdx === null) return;
    setPostalForm({
      code: cities[selectedCityIdx].districts[selectedDistrictIdx].postalCodes[
        idx
      ].code,
    });
    setEditingPostalIdx(idx);
  };

  const handleDeletePostal = async (idx: number) => {
    if (selectedCityIdx === null || selectedDistrictIdx === null) return;
    const cityId = cities[selectedCityIdx]._id;
    const districtIdx = selectedDistrictIdx;
    const postalIdx = idx;
    const districtId =
      cities[selectedCityIdx].districts[selectedDistrictIdx]?._id;
    const postalId =
      cities[selectedCityIdx].districts[selectedDistrictIdx].postalCodes[idx]
        ?._id;

    try {
      const response = await axios.delete(
        `/api/cities/${cityId}/districts/${districtId}/postalCodes/${postalId}`
      );
      if (response.status === 200) {
        setCities((prev) =>
          prev.map((city, cIdx) =>
            cIdx === selectedCityIdx
              ? {
                  ...city,
                  districts: city.districts.map((district, dIdx) =>
                    dIdx === selectedDistrictIdx
                      ? {
                          ...district,
                          postalCodes: district.postalCodes.filter(
                            (_, pIdx) => pIdx !== idx
                          ),
                        }
                      : district
                  ),
                }
              : city
          )
        );
        toast.success("Postal code deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting postal code");
    }
    setEditingPostalIdx(null);
    setPostalForm({ code: "" });
  };

  const handleTogglePostalActive = async (idx: number) => {
    if (selectedCityIdx === null || selectedDistrictIdx === null) return;
    const cityId = cities[selectedCityIdx]._id;
    const districtIdx = selectedDistrictIdx;
    const postal =
      cities[selectedCityIdx].districts[selectedDistrictIdx].postalCodes[idx];
    try {
      const response = await axios.put(
        `/api/cities/${cityId}/districts/${districtIdx}/postalCodes/${idx}`,
        {
          code: postal.code,
          active: !postal.active,
        },{withCredentials:true}
      );
      if (response.status === 200) {
        setCities((prev) =>
          prev.map((city, cIdx) =>
            cIdx === selectedCityIdx
              ? {
                  ...city,
                  districts: city.districts.map((district, dIdx) =>
                    dIdx === selectedDistrictIdx
                      ? {
                          ...district,
                          postalCodes: district.postalCodes.map((p, pIdx) =>
                            pIdx === idx ? { ...p, active: !p.active } : p
                          ),
                        }
                      : district
                  ),
                }
              : city
          )
        );
        toast.success(
          `Postal code ${postal.active ? "deactivated" : "activated"}`
        );
      }
    } catch (error) {
      toast.error("Error toggling postal code status");
    }
  };

  // --- Breadcrumb ---
  const breadcrumb = (
    <div>
      {selectedCityIdx === null && selectedDistrictIdx === null && (
        <h1 className="text-black-200 font-semibold text-xl font-sans w-80">
          Regions & Cities
        </h1>
      )}
      {(selectedCityIdx !== null || selectedDistrictIdx !== null) && (
        <span
          className="lex w-full items-end"
          onClick={() => {
            setSelectedCityIdx(null);
            setSelectedDistrictIdx(null);
          }}
        >
          <span className="hover:underline cursor-pointer"> Regions</span>
        </span>
      )}
      {selectedCityIdx !== null && (
        <>
          <span className="mx-2">{">"}</span>
          <span
            className={`hover:underline cursor-pointer ${
              selectedDistrictIdx === null ? "text-secondary font-semibold" : ""
            }`}
            onClick={() => setSelectedDistrictIdx(null)}
          >
            {cities[selectedCityIdx].name}
          </span>
        </>
      )}
      {selectedDistrictIdx !== null && selectedCityIdx !== null && (
        <>
          <span className="mx-2">{">"}</span>
          <span className="font-semibold text-secondary">
            {cities[selectedCityIdx].districts[selectedDistrictIdx].name}
          </span>
        </>
      )}
    </div>
  );

  // --- UI ---
  return (
    <div className="px-6">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        {breadcrumb}
      </div>

      <div className="mx-auto flex flex-col md:flex-row gap-8 justify-start">
        <div className="flex-1">
          {/* Cities Table */}
          {loadingCities ? (
            <div className="w-full flex justify-center items-center min-h-[200px]">
              <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-secondary rounded-full" />
              <span className="ml-2 text-secondary">Loading...</span>
            </div>
          ) : selectedCityIdx === null ? (
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left font-normal">City</th>
                  <th className="p-3 text-left font-normal">Districts</th>
                  <th className="p-3 text-left font-normal">Postal Codes</th>
                  <th className="p-3 text-left font-normal">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-semibold">{city.name}</td>
                    <td className="p-3">{city.districts.length}</td>
                    <td className="p-3">
                      {city.districts.reduce(
                        (sum, d) => sum + d.postalCodes.length,
                        0
                      )}
                    </td>
                    <td className="p-3">
                      <StatusBadge active={city.active} />
                    </td>
                    <td className="p-3 flex gap-2 justify-self-end">
                      <ActionButton
                        onClick={() => handleToggleCityActive(idx)}
                        className={
                          city.active
                            ? "text-gray-700 hover:bg-gray-100"
                            : "bg-gray-200 text-gray-500"
                        }
                      >
                        {city.active ? "Deactivate" : "Activate"}
                      </ActionButton>
                      <ActionButton onClick={() => startCityEdit(idx)}>
                        Update
                      </ActionButton>
                      <ActionButton
                        onClick={() => {
                          setSelectedCityIdx(idx);
                          setSelectedDistrictIdx(null);
                        }}
                      >
                        Districts
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteCity(idx)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedDistrictIdx === null ? (
            // Districts Table
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left font-normal">District</th>
                  <th className="p-3 text-left font-normal">Postal Codes</th>
                  <th className="p-3 text-left font-normal">Status</th>
                  <th className="p-3 text-left font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {cities[selectedCityIdx].districts.map((district, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3">{district?.name}</td>
                    <td className="p-3">
                      {district?.postalCodes?.length || 0}
                    </td>
                    <td>
                      <StatusBadge active={district.active} />
                    </td>
                    <td className="p-3 flex gap-2 justify-end">
                      <ActionButton
                        onClick={() => handleToggleDistrictActive(idx)}
                        className={
                          district.active
                            ? "text-gray-700 hover:bg-gray-100"
                            : "bg-gray-200 text-gray-500"
                        }
                      >
                        {district.active ? "Deactivate" : "Activate"}
                      </ActionButton>
                      <ActionButton onClick={() => startDistrictEdit(idx)}>
                        Update
                      </ActionButton>
                      <ActionButton onClick={() => setSelectedDistrictIdx(idx)}>
                        Postal Codes
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteDistrict(idx)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Postal Codes Table
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="font-normal p-3 text-left">Postal Code</th>
                  <th className="font-normal p-3 text-left">Status</th>
                  <th className="font-normal p-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {cities[selectedCityIdx].districts[
                  selectedDistrictIdx
                ].postalCodes.map((postal, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-medium">{postal.code}</td>
                    <td>
                      <StatusBadge active={postal.active} />
                    </td>
                    <td className="p-3 flex gap-2 justify-end">
                      <ActionButton
                        onClick={() => handleTogglePostalActive(idx)}
                        className={
                          postal.active
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gray-200 text-gray-500"
                        }
                      >
                        {postal.active ? "Deactivate" : "Activate"}
                      </ActionButton>
                      <ActionButton onClick={() => startPostalEdit(idx)}>
                        Update
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeletePostal(idx)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Right Side Add/Update Form */}
        <div className="w-full md:w-[600px]">
          <div className="bg-white rounded-md shadow p-6">
            {selectedCityIdx === null && (
              <CityForm
                form={cityForm}
                onChange={setCityForm}
                onSubmit={handleCitySubmit}
                editing={editingCityIdx !== null}
                onCancel={() => {
                  setEditingCityIdx(null);
                  setCityForm({ name: "", districts: [], newDistrict: "" });
                }}
                formLoading={formLoading}
              />
            )}
            {selectedCityIdx !== null && selectedDistrictIdx === null && (
              <DistrictForm
                form={districtForm}
                onChange={setDistrictForm}
                codes={districtPostalCodes}
                setCodes={setDistrictPostalCodes}
                newCode={newDistrictPostal}
                setNewCode={setNewDistrictPostal}
                onSubmit={handleDistrictSubmit}
                editing={editingDistrictIdx !== null}
                onCancel={() => {
                  setEditingDistrictIdx(null);
                  setDistrictForm({ name: "" });
                  setDistrictPostalCodes([]);
                  setNewDistrictPostal("");
                }}
                formLoading={formLoading}
              />
            )}
            {selectedCityIdx !== null && selectedDistrictIdx !== null && (
              <PostalCodeForm
                form={postalForm}
                onChange={setPostalForm}
                onSubmit={handlePostalSubmit}
                editing={editingPostalIdx !== null}
                onCancel={() => {
                  setEditingPostalIdx(null);
                  setPostalForm({ code: "" });
                }}
                formLoading={formLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
