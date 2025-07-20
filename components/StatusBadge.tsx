import React from "react";

export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block text-center py-1 font-medium rounded-full text-xs w-[60px] ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}