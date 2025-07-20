import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  form: { code: string };
  onChange: (form: { code: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  editing: boolean;
  onCancel?: () => void;
  formLoading?: boolean;
};

export default function PostalCodeForm({
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
        {editing ? "Update Postal Code" : "Add Postal Code"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label className="text-sm mb-1">Postal Code</Label>
          <Input
            name="postal"
            value={form.code}
            onChange={e => onChange({ code: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:border-secondary"
            required
          />
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