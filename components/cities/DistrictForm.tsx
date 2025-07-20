import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  form: { name: string };
  onChange: (form: { name: string }) => void;
  codes: string[];
  setCodes: (codes: string[]) => void;
  newCode: string;
  setNewCode: (c: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  editing: boolean;
  onCancel?: () => void;
  formLoading?: boolean;
};

export default function DistrictForm({
  form,
  onChange,
  codes,
  setCodes,
  newCode,
  setNewCode,
  onSubmit,
  editing,
  onCancel,
  formLoading
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        {editing ? "Update District" : "Add District"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label className="text-sm mb-1">District Name</Label>
          <Input
            name="district"
            value={form.name}
            onChange={e => onChange({ name: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:border-secondary"
            required
          />
        </div>
        <div>
          <Label className="text-sm mb-1">Postal Codes</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {codes.map((code, idx) => (
              <span
                key={idx}
                className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs flex items-center"
              >
                {code}
                <button
                  type="button"
                  className="ml-1 text-secondary hover:text-red-500"
                  onClick={() => setCodes(codes.filter((_, i) => i !== idx))}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add postal code"
              className="border rounded px-2 py-0.5 text-xs w-[105px] focus:outline-none focus:border-secondary"
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newCode.trim()) {
                  e.preventDefault();
                  setCodes([...codes, newCode.trim()]);
                  setNewCode("");
                }
              }}
            />
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
            <Button type="button" variant={"cancel"} className="h-8" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );
}