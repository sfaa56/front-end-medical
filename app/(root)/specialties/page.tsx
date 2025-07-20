"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { apiClient } from "@/lib/api";

type SubSpecialty = {
  _id?: string;
  name: string;
  specialty: string;
};

type Specialty = {
  _id: string;
  name: string;
  subSpecialties: SubSpecialty[];
};

function Page() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ specialty: "", subSpecialty: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subSpecialtyTags, setSubSpecialtyTags] = useState<SubSpecialty[]>([]);
  const subSpecialtyInputRef = useRef<HTMLInputElement>(null);

  // Fetch specialties from API
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await apiClient.get("/specialties");
        setSpecialties(res.data); // Make sure your API returns an array of specialties
      } catch (err) {
        // Handle error
      }
    };
    fetchSpecialties();
  }, []);

  // When editing, fill tags
  useEffect(() => {
    if (editingId !== null) {
      const sp = specialties.find((sp) => sp._id === editingId);
      setSubSpecialtyTags(
        (sp?.subSpecialties || []).map((sub, idx) => ({
          _id: sub._id || (sp?._id ? `${sp._id}-${idx}` : `${idx}`),
          name: sub.name,
          specialty: sub.specialty || sp?._id || "",
        }))
      );
      setForm({
        specialty: sp?.name || "",
        subSpecialty: "",
      });
    } else {
      setSubSpecialtyTags([]);
      setForm({ specialty: "", subSpecialty: "" });
    }
  }, [editingId, specialties]);

  // Handle tag input
  const handleSubSpecialtyInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      (e.key === "Enter" || e.key === ",") &&
      subSpecialtyInputRef.current &&
      subSpecialtyInputRef.current.value.trim()
    ) {
      e.preventDefault();
      const value = subSpecialtyInputRef.current.value.trim();
      if (value && !subSpecialtyTags.some((tag) => tag.name === value)) {
        setSubSpecialtyTags([
          ...subSpecialtyTags,
          {

            name: value,
            specialty: form.specialty,
          },
        ]);
      }
      subSpecialtyInputRef.current.value = "";
    }
  };

  // Remove tag
  const handleRemoveTag = (idx: number) => {
    setSubSpecialtyTags(subSpecialtyTags.filter((_, i) => i !== idx));
  };

  // Handle add/update submit
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("1111111111");
    e.preventDefault();
    if (!form.specialty.trim() || subSpecialtyTags.length === 0) return;

    const payload = {
      specialty: form.specialty,
      subSpecialties: subSpecialtyTags.map((tag) => ({
        _id: tag._id,
        name: tag.name,
      })),
    };

    if (editingId) {
      // UPDATE
      try {
        const res = await apiClient.put(
          `/specialties/update/${editingId}`,
          payload
        );

        if (res.status === 200) {
          setSpecialties((prev) =>
            prev.map((sp) =>
              sp._id === editingId
                ? {
                    ...sp,
                    name: payload.specialty,
                    subSpecialties: payload.subSpecialties.map((sub) => ({
                      ...sub,
                      specialty: sp._id,
                    })),
                  }
                : sp
            )
          );
        }
        setEditingId(null);
      } catch (err) {
        // Handle error
      }
    } else {
      console.log("hhhhhhhh");
      // ADD
      try {
        const res = await apiClient.post("/specialties/create", payload);
        setSpecialties((prev) => [...prev, res.data]);
      } catch (err) {
        console.log("error", err);
        // Handle error
      }
    }
    setForm({ specialty: "", subSpecialty: "" });
    setSubSpecialtyTags([]);
  };

  console.log("Specialties:", specialties);

  // Handle update button
  const handleEdit = (sp: Specialty) => {
    setForm({ specialty: sp.name, subSpecialty: "" });
    setEditingId(sp._id);
    setSubSpecialtyTags(sp.subSpecialties || []);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/specialties/delete/${id}`,{withCredentials:true});
      setSpecialties((prev) => prev.filter((sp) => sp._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ specialty: "", subSpecialty: "" });
        setSubSpecialtyTags([]);
      }
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="px-6">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans mb-4">
          Specialties
        </h1>
      </div>

      <div className="mx-auto flex flex-col md:flex-row gap-8">
        {/* Specialties List */}
        <div className="flex-1 space-y-5">
          {specialties.map((sp) => (
            <div
              key={sp._id}
              className="bg-white rounded-xl shadow p-5 transition hover:shadow-lg hover:cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === sp._id ? null : sp._id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{sp.name}</span>
                  <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                    {sp.subSpecialties?.length} Sub-specialt
                    {sp.subSpecialties?.length === 1 ? "y" : "ies"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 text-xs font-medium transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(sp);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="px-3 py-1 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 text-xs font-medium transition"
                    onClick={() =>
                      setExpandedId(expandedId === sp._id ? null : sp._id)
                    }
                  >
                    {expandedId === sp._id
                      ? "Hide Sub-specialties"
                      : "View Sub-specialties"}
                  </button>
                  <button
                    className="px-3 py-1 rounded border-red-400 border text-red-700 hover:bg-red-50 text-xs font-medium transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sp._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Animated expand/collapse */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedId === sp._id ? "max-h-40 mt-4" : "max-h-0"
                }`}
              >
                {expandedId === sp._id && (
                  <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1 marker:text-secondary">
                    {sp.subSpecialties.map((sub, idx) => (
                      <li key={idx}>{sub.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Update Specialty Form */}
        <div className="w-full md:w-[600px]">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 ">
              {editingId ? "Update Specialty" : "Add Specialty"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm mb-1">Specialty</Label>
                <Input
                  name="specialty"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialty: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 focus:border-secondary"
                  required
                />
              </div>
              <div>
                <Label className="text-sm mb-1">Sub-specialties</Label>
                <div className="flex flex-col gap-2 mb-2">
                  {subSpecialtyTags.map((tag, idx) => (
                    <div
                      key={tag._id || idx}
                      className="flex items-center gap-2"
                    >
                      <Input
                        type="text"
                        value={tag.name}
                        onChange={(e) => {
                          const updated = [...subSpecialtyTags];
                          updated[idx] = {
                            ...updated[idx],
                            name: e.target.value,
                          };
                          setSubSpecialtyTags(updated);
                        }}
                        className={`flex-1 border rounded px-2 py-1 text-xs transition ${
                          tag.name.trim() ? "bg-secondary/10" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="text-red-500 text-lg px-2"
                        onClick={() => handleRemoveTag(idx)}
                        tabIndex={-1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  ref={subSpecialtyInputRef}
                  type="text"
                  placeholder="Type a sub-specialty and press Enter"
                  onKeyDown={handleSubSpecialtyInput}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant={"submit"} className="h-10">
                  {editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant={"cancel"}
                    className="h-10"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ specialty: "", subSpecialty: "" });
                      setSubSpecialtyTags([]);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
