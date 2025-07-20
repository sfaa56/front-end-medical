"use client";
import React, { useState } from "react";
import Table from "../table";
import PaymentsNav from "@/components/payments/PaymentsNav";
import { DataTable } from "../data-table";
import columns from "./columns";

// Dummy data
const transactions = [
  {
    id: "TXN001",
    customer: "Alice",
    provider: "Ahmed",
    amount: "$120",
    commission: "$12",
    date: "2024-06-01",
    status: "Success",
    service:"software"
  },
  {
    id: "TXN002",
    customer: "Bob",
    provider: "Karem",
    amount: "$80",
    commission: "$8",
    date: "2024-06-02",
    status: "Failed",
    service:"Electrician"
  },
  // ...more
];


const statusColors: Record<string, string> = {
  Success: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
};

const TransactionPage = () => {
  // Filter state
  const [filter, setFilter] = useState({ date: "", provider: "", status: "" });

  // Filter logic
  const filtered = transactions.filter(
    (t) =>
      (!filter.date || t.date === filter.date) &&
      (!filter.provider || t.provider === filter.provider) &&
      (!filter.status || t.status === filter.status)
  );

  // Unique providers/status for filter dropdowns
  const providers = Array.from(new Set(transactions.map((t) => t.provider)));
  const statuses = Array.from(new Set(transactions.map((t) => t.status)));

  return (
    <div className=" ">



      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
      />


    </div>
  );
};

export default TransactionPage;
