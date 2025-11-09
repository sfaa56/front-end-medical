"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSpecialties } from "@/hooks/useSpecialties";
import { useCategories } from "@/features/categories/useCategories";
import {
  addingCategory,
  deleteCategory,
  updateCategories,
} from "@/features/categories/categoriesServices";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import Loading from "@/components/Loading";

// ✅ Validation Schema
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  specialty: z.string().min(1, "Please select a specialty"),
  subCategories: z.array(z.string()).min(1, "At least one service is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

function Page() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [serviceTags, setServiceTags] = useState<string[]>([]);
  const serviceInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch specialties
  const { specialties, loading: specialtiesLoading } = useSpecialties();

  // Fetch categories
  const {
    setCategories,
    categories,
    loading: categoriesLoaidng,
  } = useCategories();

  // 🔹 React Hook Form setup
  const {
    getValues,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", specialty: "", subCategories: [] },
  });

  // 🔹 Add service tag
  const handleServiceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === ",") &&
      serviceInputRef.current &&
      serviceInputRef.current.value.trim()
    ) {
      e.preventDefault();
      const value = serviceInputRef.current.value.trim();
      if (value && !serviceTags.includes(value)) {
        const updated = [...serviceTags, value];
        setServiceTags(updated);
        setValue("subCategories", updated);
      }
      serviceInputRef.current.value = "";
    }
  };

  // 🔹 Remove tag
  const handleRemoveTag = (idx: number) => {
    const updated = serviceTags.filter((_, i) => i !== idx);
    setServiceTags(updated);
    setValue("subCategories", updated);
  };

  console.log("error", errors);
  console.log("editingId", editingId);

  // 🔹 Submit handler
  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      console.log("data", data);
      if (editingId) {
        const updated = await updateCategories(data, setLoading);
        if (updated) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat._id === editingId ? { ...cat, ...updated } : cat
            )
          );

          setEditingId(null);
          reset({
            id: "",
            name: "",
            specialty: "",
            subCategories: [],
          });
        }
      } else {
        const newCat = await addingCategory(data, setLoading);
        if (newCat) {
          setCategories((prev) => [...prev, newCat]);
        }
      }
      reset({
        id: "",
        name: "",
        specialty: "",
        subCategories: [],
      });
      setServiceTags([]);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // 🔹 Handle edit
  const handleEdit = (cat: (typeof categories)[0]) => {
    setEditingId(cat._id);
    console.log("cat", cat);
    reset({
      id: cat._id,
      name: cat.name,
      specialty: cat.specialty._id,
      subCategories: cat.subCategories.map((sub) => sub.name),
    });
    console.log("getValue", getValues("subCategories"));
    setServiceTags(cat.subCategories.map((sub) => sub.name));
  };

  // 🔹 Handle delete
  const handleDelete = async (id: number) => {
    console.log("id", id);
    try {
      const result = await deleteCategory(id, setLoading);

      if (result) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        if (editingId === id) {
          setEditingId(null);
          reset({
            id: "",
            name: "",
            specialty: "",
            subCategories: [],
          });
          setServiceTags([]);
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  console.log("categories", categories);

  return (
    <div className="px-6">
      <div className="flex w-full items-end">
        <h1 className="text-black-200 font-semibold text-xl font-sans mb-4">
          Categories
        </h1>
      </div>

      <div className="mx-auto flex flex-col md:flex-row gap-8">
        {/* Categories List */}
        {categoriesLoaidng || categories.length === 0 ? (
          <Loading />
        ) : (
          <div className="flex-1 space-y-5">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-xl shadow p-5 transition hover:shadow-lg hover:cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === cat._id ? null : cat._id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{cat.name}</span>
                    <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                      {cat.subCategories.length} Service
                      {cat.subCategories.length > 1 ? "s" : ""}
                    </span>

                    <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                      {cat?.specialty?.name} 

                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cat);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 rounded border-red-300 border text-red-700 hover:bg-red-50 text-xs font-medium transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedId === cat._id ? "max-h-40 mt-4" : "max-h-0"
                  }`}
                >
                  {expandedId === cat._id && (
                    <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1 marker:text-secondary">
                      {cat.subCategories.map((service, idx) => (
                        <li key={idx}>{service.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Update Category Form */}
        <div className="w-full md:w-[600px]">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Update Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Category Name */}
              <div>
                <Label className="text-sm mb-1">Category Name</Label>
                <Input
                  {...register("name")}
                  className="w-full border rounded px-3 py-2 focus:border-secondary"
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Specialty Select */}
              <div>
                <Label className="text-sm mb-1">Specialty</Label>
                <select
                  {...register("specialty")}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    {specialtiesLoading
                      ? "Loading specialties..."
                      : "Select a specialty"}
                  </option>
                  {specialties.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.specialty.message}
                  </p>
                )}
              </div>

              {/* Services Tags */}
              <div>
                <Label className="text-sm">Services</Label>
                <div className="flex flex-col gap-2 mb-1">
                  {serviceTags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const updated = [...serviceTags];
                          updated[idx] = e.target.value;
                          setServiceTags(updated);
                          setValue("subCategories", updated);
                        }}
                        className="flex-1 border rounded px-2 py-1 text-xs transition"
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
                  ref={serviceInputRef}
                  type="text"
                  placeholder="Type a service and press Enter"
                  onKeyDown={handleServiceInput}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.subCategories && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subCategories.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  disabled={loading}
                  type="submit"
                  variant={"submit"}
                  className="h-10"
                >
                  {loading ? <LoadingSpinner /> : editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant={"cancel"}
                    className="h-10"
                    onClick={() => {
                      setEditingId(null);
                      reset({
                        id: "",
                        name: "",
                        specialty: "",
                        subCategories: [],
                      });
                      setServiceTags([]);
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
