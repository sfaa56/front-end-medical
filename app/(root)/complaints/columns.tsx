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

export type complaints = {
  id: string;
  sender: string;
  receiver: string;
  type: string;
  status: string;
  date: string;
};

const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Pending: "bg-gray-100 text-gray-700",
  Rejected: "bg-red-100 text-red-700",
};

const columns: ColumnDef<complaints>[] = [
  { accessorKey: "id", header: "Complaint ID" },
  { accessorKey: "sender", header: "Sender" },
  { accessorKey: "receiver", header: "Receiver" },
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
  { accessorKey: "date", header: "Date" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const complaint = row.original;
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
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-2 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="font-bold mb-6 text-lg text-gray-700 border-b pb-3 ">
                   Complaint Number:
                  <span className=""> #{complaint.id}</span>
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600 ">
                      Sender
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">{complaint.sender}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600">
                      Receiver
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">{complaint.receiver}</span>
                  </div>

                      <div className="flex">
                    <span className="w-32 font-medium text-gray-600">
                      Service
                    </span>
                    <span className="text-secondary underline hover:cursor-pointer">Car repair</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600">Type</span>
                    <span>{complaint.type}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-gray-600">Date</span>
                    <span>{complaint.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">
                      Content
                    </span>
                    <p className="border rounded-md p-3 bg-gray-50 text-gray-800 break-words whitespace-pre-line">
                      The provider was an hour behind schedule and did not
                      answer the phone
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">
                      Official response
                    </span>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm focus:outline-secondary"
                      rows={3}
                      placeholder="Type your official response here..."
                    />
                  </div>

           

                  <div className="flex  flex-col">
                    <span className="font-medium text-gray-600 block mb-1">
                      Change Status
                    </span>

                    <Select onValueChange={(value) => {}}>
                      <SelectTrigger className="gap-4">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>

                      <SelectContent>
                                                <SelectItem value={"In Progress"}>In Progress</SelectItem>

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
                      onClick={() => setOpen(false)}
                    >
                      Save Reply
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
