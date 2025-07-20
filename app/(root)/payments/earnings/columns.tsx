"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";

export type Earning = {
  id: string;
  invoiceId: string;
  providerId: string;
  providerName: string;
  service: string;
  amount: number; // صافي ربح المزود
  status: 'pending' | 'available' | 'withdrawn';
  createdAt: string;
  availableAt: string; // متى يكون قابل للسحب
  withdrawalId?: string;
};

const statusColors: Record<Earning["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  available: "bg-green-100 text-green-700",
  withdrawn: "bg-blue-100 text-blue-700",
};

const columns: ColumnDef<Earning>[] = [
  { accessorKey: "id", header: "Earning ID" },
  { accessorKey: "invoiceId", header: "Invoice ID" },
  { accessorKey: "providerName", header: "Provider Name" },
  { accessorKey: "service", header: "Service" },
  { accessorKey: "amount", header: "Net Earning" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "availableAt", header: "Available At" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        href={`/earnings/${row.original.id}`}
        className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs  hover:bg-gray-200 transition"
      >
        View Details
      </Link>
    ),
  },
];

export default columns;