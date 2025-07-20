"use client";
import React from "react";
import { DataTable } from "./data-table";
import columns from "./columns";

const complaints = [
  {
    id: "C-1001",
    sender: "Ahmed Hassan",
    receiver: "Mohamed Tarek",
    type: "Complaint",
    status: "Pending",
    date: "2025-06-07",
    message: "The provider did not arrive on time.",
  },
  {
    id: "C-1002",
    sender: "Mona Samir",
    receiver: "Youssef Adel",
    type: "Inquiry",
    status: "Resolved",
    date: "2025-06-06",
    message: "Can I reschedule the service appointment?",
  },
  {
    id: "C-1003",
    sender: "Heba Ali",
    receiver: "Omar Nabil",
    type: "Suggestion",
    status: "Rejected",
    date: "2025-06-05",
    message: "I suggest adding a window cleaning service.",
  },
  {
    id: "C-1004",
    sender: "Khaled Saad",
    receiver: "Samy Maher",
    type: "Complaint",
    status: "In Progress",
    date: "2025-06-04",
    message: "The service was performed very poorly.",
  },
  {
    id: "C-1005",
    sender: "Sara Mohammed",
    receiver: "Hany Refaat",
    type: "Inquiry",
    status: "Resolved",
    date: "2025-06-03",
    message: "Are there any discounts on weekly services?",
  },
];

function Page() {
  return (
    <div className="px-6">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans  mb-4">
          Complaints & Support
        </h1>
      </div>
      <DataTable columns={columns} data={complaints} />
    </div>
  );
}

export default Page;
