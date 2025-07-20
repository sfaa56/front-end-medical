"use client";
import React, { useState } from "react";
import Table from "../table";
import PaymentsNav from "@/components/payments/PaymentsNav";
import FinancialKPIs from "../FinancialKPIs";
import { DataTable } from "../data-table";
import columns from "./columns";

// Dummy data
const invoices = [
  {
    id: "INV001",
    client:"Ahmed",
    provider: "Plumber Pro",
        service:"software",

    amount: "$120",
    date: "2024-06-01",
    status: "Paid",
  },
  {
    id: "INV001",
    provider: "Electrician Hub",
    client: "Ali",

    amount: "$80",
    date: "2024-06-02",
  
    status: "Unpaid",
    service:"Electrician"

  },
  // ...more
];





const InvoicesPage = () => {
  const [filter, setFilter] = useState({ provider: "", date: "" });

  // Filter logic
  const filtered = invoices.filter(
    (inv) =>
      (!filter.provider || inv.provider === filter.provider) &&
      (!filter.date || inv.date === filter.date)
  );

  // Unique providers for filter dropdown
  const providers = Array.from(new Set(invoices.map((i) => i.provider)));





  return (
    <div  >

<DataTable columns={columns} data={invoices} />
    </div>
  );
};

export default InvoicesPage;
