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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { deleteServiceRequest } from "@/features/ServiceRequests/serviceRequest";
import { removeRequest } from "@/features/ServiceRequests/ServiceRequestsSlice";
import { toast } from "sonner";

// 🆕 Define the service request type
export type ServiceRequest = {
  _id: string;
  title: string;
  description: string;
  specialty: {
    _id: string;
    name: string;
  };
  subSpecialty?: {
    _id: string;
    name: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  postalCode?: {
    code: string;
    district?: {
      name: string;
      city?: {
        name: string;
      };
    };
  };
  status: "completed" | "waiting" | "inprogress";
  place?: string;
  price?: string;
  priceType?: string;
  currency?: string;
  offers?: string[];
  clientId?: string;
  patientDetails: any; // you can populate it on backend or frontend
  createdAt?: string;
};

// 🆕 ActionCell component for ServiceRequest
const ActionCell = ({ row }: { row: { original: ServiceRequest } }) => {
  const request = row.original;

  const dispatch = useDispatch<AppDispatch>();

  const deleteU = async (id) => {
    console.log("id", id);
    try {
      const resultAction = await dispatch(removeRequest(id));

      if (removeRequest.fulfilled.match(resultAction)) {
        toast.success("Request deleted successfully");
      } else {
        const errorMessage =
          (resultAction as any)?.error?.message || "Unknown error";
        console.error("Failed to delete Request:", errorMessage);
        toast.error("Failed to delete Request");
      }
    } catch (error) {
      console.error("Error deleting Request:", error);
      toast.error("Failed to delete Request");
    }
  };

  const user = row.original;

  return (
    <div className="flex  gap-2 justify-center">
      <Link href={`/ServiceRequests/view/${user?._id}`}>
        <button
          title="View"
          className="p-2 rounded hover:bg-gray-100 text-blue-600"

        >
          <FiEye />
        </button>
      </Link>

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
                deleteU(user._id);
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
      cell: ({ row }) => row.original.specialty?.name || "N/A",
    },
    {
      accessorKey: "postalCode",
      header: "City",
      cell: ({ row }) =>
        row.original.postalCode?.district?.city?.name ||
        row.original.postalCode?.district?.name ||
        "N/A",
    },
    {
      accessorKey: "offers",
      header: "Offers",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.offers?.length ?? 0}</span>
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
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusClasses[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => row?.original?.patientDetails?.name || "N/A",
    },
    {
      id: "actions",
      header: () => <span className="ml-[38%]">Actions</span>,
      cell: ActionCell,
    },
  ];

  return columns;
};
