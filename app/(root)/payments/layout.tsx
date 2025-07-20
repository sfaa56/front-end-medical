import React from "react";
import FinancialKPIs from "./FinancialKPIs";
import PaymentsNav from "@/components/payments/PaymentsNav";
// Dummy data
const invoices = [
  {
    id: "INV001",
    provider: "Plumber Pro",
    amount: "$120",
    date: "2024-06-01",
    status: "Paid",
  },
  {
    id: "INV002",
    provider: "Electrician Hub",
    amount: "$80",
    date: "2024-06-02",
    status: "Unpaid",
  },
  // ...more
];
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const totalPayments = 2000;
  const totalEarnings = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.amount.replace("$", "")), 0);
  const totalInvoices = invoices.length;
  const pendingWithdrawals = 3;
  const totalCommission = "20%";

  const kpis = [
    { label: "Total Payments", value: `$${totalPayments}` },
    { label: "Platform Earnings", value: `$${totalEarnings}` },
    { label: "Total Invoices", value: totalInvoices },
    { label: "Pending Withdrawals", value: pendingWithdrawals },
    { label: "Commission", value: `${totalCommission}` },
  ];

  return (
    <div className="px-6">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans  mb-4">
          Payment
        </h1>
      </div>
      <FinancialKPIs kpis={kpis} />

      <PaymentsNav />
      {children}
    </div>
  );
}
