import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { District } from "@/types/cities";

type Props = {
  form: { name: string; districts: District[]; newDistrict: string };
  onChange: (form: Props["form"]) => void;
  onSubmit: (e: React.FormEvent) => void;
  editing: boolean;
  onCancel?: () => void;
  formLoading?: boolean;
};

export default function CityForm({
  form,
  onChange,
  onSubmit,
  editing,
  onCancel,
  formLoading,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        {editing ? "Update City" : "Add City"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label className="text-sm mb-1">City Name</Label>
          <Input
            name="city"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className="w-full rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <Label className="text-sm mb-1">Districts</Label>
          <div className="flex flex-wrap gap-2">
            {form.districts.map((district, dIdx) => (
              <div
                key={dIdx}
                className="flex flex-col bg-gray-50 rounded p-2 mb-2 gap-3"
              >

                <div className="flex items-start justify-between -mt-2">
                  <span className="font-medium">{district.name}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() =>
                      onChange({
                        ...form,
                        districts: form.districts.filter((_, i) => i !== dIdx),
                      })
                    }
                  >
                    ×
                  </button>
                </div>

                

                <div className="flex flex-wrap gap-1">
                  {district.postalCodes.map((pc, pIdx) => (
                    <span
                      key={pIdx}
                      className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs flex items-center"
                    >
                      {pc.code}
                      <button
                        type="button"
                        className="ml-1 text-secondary hover:text-red-500"
                        onClick={() =>
                          onChange({
                            ...form,
                            districts: form.districts.map((d, i) =>
                              i === dIdx
                                ? {
                                    ...d,
                                    postalCodes: d.postalCodes.filter(
                                      (_, j) => j !== pIdx
                                    ),
                                  }
                                : d
                            ),
                          })
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add postal code"
                    className="border rounded px-2 py-0.5 text-xs w-[105px] focus:outline-none focus:border-secondary"
                    value={district.newPostalCode || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange({
                        ...form,
                        districts: form.districts.map((d, i) =>
                          i === dIdx ? { ...d, newPostalCode: val } : d
                        ),
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && district.newPostalCode?.trim()) {
                        e.preventDefault();
                        onChange({
                          ...form,
                          districts: form.districts.map((d, i) =>
                            i === dIdx
                              ? {
                                  ...d,
                                  postalCodes: d.newPostalCode
                                    ? [
                                        ...d.postalCodes,
                                        {
                                          code: d.newPostalCode.trim(),
                                          active: true,
                                        },
                                      ]
                                    : [...d.postalCodes],
                                  newPostalCode: "",
                                }
                              : d
                          ),
                        });
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              type="text"
              placeholder="District name"
              value={form.newDistrict || ""}
              onChange={(e) =>
                onChange({ ...form, newDistrict: e.target.value })
              }
              className="w-48 border rounded"
            />
            <Button
              type="button"
              variant={"submit"}
              className="h-auto bg-transparent text-black border hover:bg-transparent hover:border-gray-400"
              onClick={() => {
                if (!form.newDistrict?.trim()) return;
                onChange({
                  ...form,
                  districts: [
                    ...form.districts,
                    {
                      name: form.newDistrict.trim(),
                      active: true,
                      postalCodes: [],
                      newPostalCode: "",
                    },
                  ],
                  newDistrict: "",
                });
              }}
            >
              Add District
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
       <Button type="submit" variant={"submit"} disabled={formLoading}>
        {formLoading ? (
          <span className="flex items-center">
            <span className="animate-spin h-4 w-4 mr-2 border-2 border-gray-300 border-t-secondary rounded-full" />
            Saving...
          </span>
        ) : (
          editing ? "Update" : "Add"
        )}
      </Button>
          {editing && onCancel && (
            <Button
              type="button"
              variant={"cancel"}
              className="h-8"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
