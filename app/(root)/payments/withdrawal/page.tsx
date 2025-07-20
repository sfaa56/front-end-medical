"use client"
import React, { useState } from "react";
import Table from "../table";
import PaymentsNav from "@/components/payments/PaymentsNav";
import { DataTable } from "../data-table";
import  columns from "./columns"

// Dummy data
const withdrawals = [
  {
    id: "1",
    provider: "Plumber Pro",
    amount: "$200",
    date: "2024-06-03",
    status: "Pending",
    details: "Bank: ABC, IBAN: 123456789",
  },
  {
    id: "2",
    provider: "Electrician Hub",
    amount: "$150",
    date: "2024-06-04",
    status: "Approved",
    details: "Bank: XYZ, IBAN: 987654321",
  },
  // ...more
];


const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const WithdrawalsPage = () => {


  return (
    <div className="">
  
   

      <DataTable columns={columns} data={withdrawals}/>
   
     

    </div>
  );
};

export default WithdrawalsPage;