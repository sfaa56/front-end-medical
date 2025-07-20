import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type invoice = {
  id: string;
  client: string;
  provider: string;
  service: string;
  date: string;
  amount: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientId?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerId?: string;
  basePrice?: string;
  platformFee?: string;
  providerNet?: string;
  activity?: { event: string; date: string }[];
  adminNotes?: string;
};

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const columns: ColumnDef<invoice>[] = [
  { accessorKey: "id", header: "Invoice ID" },
  { accessorKey: "client", header: "Client Name" },
  { accessorKey: "provider", header: "Provider Name" },
  { accessorKey: "service", header: "Service" },
  { accessorKey: "date", header: "Creation Date" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      );
    },
  },
    {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        href={`/invoices/${row.original.id}`}
        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs   transition"
      >
        View Details
      </Link>
    ),
  },
];

export default columns;