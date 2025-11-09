import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formDataFromCreatedAt } from "@/lib/utils";
import Link from "next/link";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateComplaint } from "@/features/complaint/complaintSlice";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

export type complaints = {
  _id: string;
  complaintNumber: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  serviceId: any;
  type: string;
  status: string;
  date: string;
  content: any;
  officialResponse: any;
};

const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Pending: "bg-gray-100 text-gray-700",
  Rejected: "bg-red-100 text-red-700",
};

const columns: ColumnDef<complaints>[] = [
  { accessorKey: "complaintNumber", header: "Complaint ID" },

  {
    accessorKey: "sender",
    header: "Sender",

    cell: ({ row }) => row.original.sender.firstName || "N/A",
  },

  {
    accessorKey: "receiver",
    header: "Receiver",

    cell: ({ row }) => row.original.receiver.firstName || "N/A",
  },
  { accessorKey: "type", header: "Type" },
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
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return formDataFromCreatedAt(row.original.date);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const complaint = row.original;

      const [status, setStatus] = useState(complaint.status);
      const [officialResponse, setOfficialResponse] = useState(
        complaint.officialResponse || ""
      );

      const dispatch = useDispatch<AppDispatch>();

      const { updating } = useSelector((state: RootState) => state.complaints);

      const handleSave = async () => {
        const data = {
          status,
          officialResponse,
        };

        try {
          await dispatch(updateComplaint({ id: complaint._id, data }));

          setOpen(false);
        } catch (error) {
          toast.error("Something went wrong");
        }
      };

      return (
        <>
          <button
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs  hover:bg-gray-200 transition"
            onClick={() => setOpen(true)}
          >
            View Details
          </button>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-xl p-6  w-auto min-w-[36%] mx-2 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="font-bold mb-6 text-lg text-gray-700 border-b pb-3 ">
                  Complaint Number:
                  <span className=""> #{complaint.complaintNumber}</span>
                </h2>
                <div className="space-y-4 text-sm">
                  <Link
                    href={`/users/view/${complaint?.sender?._id}`}
                    className="flex"
                  >
                    <span className="w-32 font-medium text-gray-600 ">
                      Sender
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">
                      {complaint.sender.firstName || "N/A"}{" "}
                      {complaint.sender.lastName || "N/A"}
                    </span>
                  </Link>

                  <Link
                    href={`/users/view/${complaint?.receiver?._id}`}
                    className="flex"
                  >
                    <span className="w-32 font-medium text-gray-600">
                      Receiver
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">
                      {complaint.receiver.firstName || "N/A"}{" "}
                      {complaint.receiver.lastName || "N/A"}
                    </span>
                  </Link>

                  <Link
                    href={`/ServiceRequests/view/${complaint.serviceId._id}`}
                    className="flex"
                  >
                    <span className="w-32 font-medium text-gray-600">
                      Service
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">
                      {complaint.serviceId.title || "N/A"}
                    </span>
                  </Link>

                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600">Type</span>
                    <span>{complaint?.type}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600">Date</span>
                    <span>{formDataFromCreatedAt(complaint?.date)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">
                      Content
                    </span>
                    <p className="border rounded-md p-3 bg-gray-50 text-gray-800 break-words whitespace-pre-line">
                      {complaint.content}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">
                      Official response
                    </span>
                    <textarea
                      value={officialResponse}
                      onChange={(e) => setOfficialResponse(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm focus:outline-secondary"
                      rows={3}
                      placeholder="Type your official response here..."
                    />
                  </div>

                  <div className="flex  flex-col">
                    <span className="font-medium text-gray-600 block mb-1">
                      Change Status
                    </span>

                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="gap-4">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value={"In Progress"}>
                          In Progress
                        </SelectItem>

                        <SelectItem value={"Pending"}>Pending</SelectItem>
                        <SelectItem value={"Resolved"}>Resolved</SelectItem>
                        <SelectItem value={"Rejected"}>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-start mt-2">
                    <Button
                      variant={"submit"}
                      className=""
                      onClick={handleSave}
                      disabled={updating}
                    >
                      {updating ? <LoadingSpinner /> : "Save Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

export default columns;
