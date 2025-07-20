"use client";

import { ColumnDef } from "@tanstack/react-table";

export type transaction = {
  id: string;
  customer: string;
  provider: string;
  service:string;
  amount: string;
  commission: string;
  date: string;
  status: string;
};

const columns: ColumnDef<transaction>[] = [
  { accessorKey: "id", header: "Transaction ID" },
  { accessorKey: "customer", header: "Customer Name" },
  { accessorKey: "provider", header: "Provider Name" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey:"service",header:"Service"},
  { accessorKey: "commission", header: "Commission" },
  { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            status === "Success"
              ? "bg-green-100 text-green-700"
              : "bg-red-200 text-red-600"
          }
        `}
          >
            {status}
          </span>
        );
      },
    },
];

export default columns;