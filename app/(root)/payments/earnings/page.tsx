import React from "react";

import { Earning } from "./columns";
import columns from "./columns";
import { DataTable } from "../data-table";

const dummyData: Earning[] = [
  {
    id: "EARN-001",
    invoiceId: "INV-2024-001",
    providerId: "PR-001",
    providerName: "Ahmed Mohamed",
    service: "Web Design",
    amount: 1200,
    status: "pending",
    createdAt: "2024-06-01",
    availableAt: "2024-06-10",
    withdrawalId: undefined,
  },
  {
    id: "EARN-002",
    invoiceId: "INV-2024-002",
    providerId: "PR-002",
    providerName: "Sara Ali",
    service: "App Development",
    amount: 2500,
    status: "available",
    createdAt: "2024-06-03",
    availableAt: "2024-06-12",
    withdrawalId: undefined,
  },
  {
    id: "EARN-003",
    invoiceId: "INV-2024-003",
    providerId: "PR-003",
    providerName: "Mohamed Fathy",
    service: "SEO Optimization",
    amount: 800,
    status: "withdrawn",
    createdAt: "2024-06-05",
    availableAt: "2024-06-15",
    withdrawalId: "WD-001",
  },
];

function page() {
  return (
  <div>
  <DataTable columns={columns} data={dummyData} />;
  </div>)
}

export default page;
