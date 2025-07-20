"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type withdrawal = {
  id: string;
  provider: string;
  amount: string;
  date: string;
  status: string;
  details: string;
  // Add these fields for the modal
  orderNumber?: string;
  paymentMethod?: string;
  accountNumber?: string;
  providerFullName?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerApplications?: number;
  providerTotalWithdrawn?: string;
};

const columns: ColumnDef<withdrawal>[] = [
  { accessorKey: "id", header: "Request ID" },
  { accessorKey: "provider", header: "Provider Name" },
  { accessorKey: "amount", header: "Requested Amount" },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: withdrawal } }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "Approved"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-200 text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
{
  id: "actions",
  cell: ({ row }) => {
    const [modal, setModal] = useState<{ open: boolean }>({ open: false });
    const [localStatus, setLocalStatus] = useState(row.original.status);

    // Dummy provider data (replace with real data as needed)
    const providerData = {
      fullName: row.original.providerFullName || "Ahmed Mohamed",
      email: row.original.providerEmail || "ahmed@example.com",
      phone: row.original.providerPhone || "01001234567",
      applications: row.original.providerApplications ?? 5,
      totalWithdrawn: row.original.providerTotalWithdrawn || "EGP 9,200",
    };

    // Dummy withdrawal data (replace with real data as needed)
    const withdrawalData = {
      orderNumber: row.original.orderNumber || "WD-2098",
      creationDate: row.original.date,
      status: localStatus,
      amount: row.original.amount || "EGP 2,500",
      paymentMethod: row.original.paymentMethod || "Vodafone Cash",
      accountNumber: row.original.accountNumber || "01001234567",
    };

    // Handlers to update local status
    const handleApprove = () => setLocalStatus("Approved");
    const handleReject = () => setLocalStatus("Rejected");

    return (
      <>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            onClick={() => setModal({ open: true })}
          >
            View Details
          </button>
          {row.original.status === "Pending" && (
            <>
              <button
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          )}
        </div>
        {/* Modal for details */}
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-2 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setModal({ open: false })}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="font-bold mb-4 text-lg text-gray-700">
                Withdrawal Request Details
              </h2>
              {/* Section 1: Basic Info */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-sm text-gray-700">
                  Basic Information
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order number</span>
                    <span>{withdrawalData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Creation date</span>
                    <span>{withdrawalData.creationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current status</span>
                    <span className="capitalize">
                      {withdrawalData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">The required amount</span>
                    <span>{withdrawalData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment method</span>
                    <span>{withdrawalData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Wallet/account number
                    </span>
                    <span>{withdrawalData.accountNumber}</span>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              {/* Section 2: Provider Info */}
              <div>
                <h3 className="font-semibold mb-2 text-sm text-gray-700 flex items-center gap-1">
                  Service Provider Data
                  <a
                    href={`/providers/${row.original.provider}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-secondary underline hover:cursor-pointer text-sm"
                  >
                    View Profile
                  </a>
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full name</span>
                    <span>{providerData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">E-mail address</span>
                    <span>{providerData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone number</span>
                    <span>{providerData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Number of previous applications
                    </span>
                    <span>{providerData.applications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Total profits withdrawn
                    </span>
                    <span>{providerData.totalWithdrawn}</span>
                  </div>
                </div>
              </div>
              {/* Confirm/Reject Buttons */}
              {localStatus === "Pending" && (
                <div className="mt-6 flex gap-3 justify-between">
                  <button
                    className="px-4 py-2 w-full bg-secondary text-white rounded hover:bg-secondary/90 transition text-sm font-medium"
                    onClick={handleApprove}
                  >
                    Confirm Withdraw
                  </button>
                  <button
                    className="px-4 py-2 w-full bg-red-600 text-white rounded hover:bg-red-500 transition text-sm font-medium"
                    onClick={handleReject}
                  >
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  },
}
];

export default columns;
