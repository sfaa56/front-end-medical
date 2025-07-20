"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiEdit, FiDelete, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// 🆕 Define the service request type
export type ServiceRequest = {
  _id: string;
  title: string;
  specialty: string;
  city: string;
  numberOfOffers: number;
  status: "completed" | "waiting" | "inprogress";
  clientName: string;
};

// 🆕 ActionCell component for ServiceRequest
const ActionCell = ({ row }: { row: { original: ServiceRequest } }) => {
  const request = row.original;

  return (
    <div className="flex  gap-2 justify-center">
      <Link href={`/ServiceRequests/view/2`}>
      <button
        title="View"
        className="p-2 rounded hover:bg-gray-100 text-blue-600"
        onClick={() => {
          // View logic here
        }}
      >
        <FiEye />
      </button></Link>

  

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="p-2 rounded hover:bg-gray-100 text-red-500"
            title="Delete"
            onClick={(e) => e.stopPropagation()}
          >
            <FiDelete />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
              <FiTrash2 className="text-2xl text-red-500" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-red-600">
              Delete Request
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center text-gray-600 mb-4">
            Are you sure you want to{" "}
            <span className="font-semibold text-red-500">delete</span> the
            request titled{" "}
            <span className="font-semibold">{request.title}</span>?<br />
            This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter className="flex justify-center gap-2">
            <AlertDialogCancel className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.stopPropagation();
                // deleteServiceRequest(request._id); // You must implement this
              }}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// 🆕 getColumns function for ServiceRequest
export const getColumns = (): ColumnDef<ServiceRequest>[] => {
  const columns: ColumnDef<ServiceRequest>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "specialty",
      header: "Specialty",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "numberOfOffers",
      header: "Offers",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.numberOfOffers}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusClasses = {
          completed: "bg-green-100 text-green-700",
          waiting: "bg-yellow-100 text-yellow-700",
          inprogress: "bg-blue-100 text-blue-700",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "clientName",
      header: "Client",
    },
    {
      id: "actions",
     header: () => <span className="ml-[38%]">Actions</span>,

      cell: ActionCell,
    },
  ];

  return columns;
};
