"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

// Dummy data for demonstration (replace with real fetch)
const invoices = [
  {
    id: "INV001",
    client: "Ahmed",
    provider: "Plumber Pro",
    service: "Mobile App Development",
    date: "2024-06-01",
    amount: "$120",
    status: "Paid",
    paymentMethod: "Card",
    transactionId: "TXN-123456",
    clientEmail: "client@email.com",
    clientPhone: "01000000000",
    clientId: "CL-001",
    providerEmail: "provider@email.com",
    providerPhone: "01000000001",
    providerId: "PR-001",
    basePrice: "$120",
    platformFee: "$12",
    providerNet: "$108",
    activity: [
      { event: "✔ Invoice created", date: "2024-06-01" },
      { event: "✔ Payment made", date: "2024-06-01" },
      {
        event: "❌ Status changed from 'Paid' to 'Unpaid'",
        date: "2024-06-02",
      },
    ],
    adminNotes: "Manual adjustment due to payment gateway issue.",
  },
  // ...more invoices
];

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  // // Replace with real fetch logic
  // const invoice = useMemo(
  //   () => invoices.find((inv) => inv.id === invoiceId),
  //   [invoiceId]
  // );

  const invoice = invoices[0];

  // if (!invoice) {
  //   return (
  //     <div className="p-8">
  //       <h2 className="text-xl font-bold mb-4">Invoice Not Found</h2>
  //       <button
  //         className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
  //         onClick={() => router.back()}
  //       >
  //         Back to Invoices List
  //       </button>
  //     </div>
  //   );
  // }

  // Local state for status and notes (optional)
  const [localStatus, setLocalStatus] = useState(invoice.status);
  const [adminNotes, setAdminNotes] = useState(invoice.adminNotes);

  return (
    <div className="px-6 mb-10">
      <nav
        className="flex items-center text-sm text-gray-500 mb-4"
        aria-label="Breadcrumb"
      >
        <Link href={"/overview"}>
          <span className="hover:underline cursor-pointer ">Home</span>
        </Link>
        <FiChevronRight className="mx-2" />

        <Link href={"/payments/invoice"}>
          <span className="hover:underline cursor-pointer ">Invoices</span>
        </Link>
        <FiChevronRight className="mx-2" />
        <span className=" t">{invoice.id}</span>
      </nav>

      <div className="flex justify-between">
        {" "}
        <h2 className="text-black-200 mb-5 font-semibold text-xl font-sans w-80 flex items-center gap-2">
          Invoice Details
          <span
            className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[invoice.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {invoice.status}
          </span>
        </h2>
        {/* Actions at the top */}
        <div className="flex flex-wrap gap-2 justify-end mb-6">
          <Button
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition text-sm font-medium"
            onClick={() => alert("Mark as Paid (not implemented)")}
          >
            Mark as Paid
          </Button>
          <Button
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition text-sm font-medium"
            onClick={() => alert("Mark as Unpaid (not implemented)")}
          >
            Mark as Unpaid
          </Button>
          <Button
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition text-sm font-medium"
            onClick={() => alert("Download PDF (not implemented)")}
          >
            Download PDF
          </Button>
          <Button
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 transition text-sm font-medium"
            onClick={() => alert("Send Invoice (not implemented)")}
          >
            Send Invoice
          </Button>
        </div>
      </div>

      {/* 1. Basic Invoice Info */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-medium mb-3  text-gray-700">
          Basic Invoice Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-y-2 text-sm">
          {/* Left column (4 fields) */}
          <div>
            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Invoice ID</span>
              <span className="font-medium">{invoice.id}</span>
            </div>

            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Payment Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  statusColors[invoice.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Service Name</span>
              <span className="font-medium">Software / {invoice.service}</span>
            </div>

            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Total Amount</span>
              <span className="font-medium">{invoice.amount}</span>
            </div>
          </div>
          {/* Right column (3 fields) */}
          <div>
            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Creation Date</span>
              <span className="font-medium">{invoice.date}</span>
            </div>

            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Payment Method</span>
              <span className="font-medium">{invoice.paymentMethod}</span>
            </div>
            <div className="flex mb-2">
              <span className="w-32 text-gray-800">Transaction ID</span>
              <span className="font-medium">{invoice.transactionId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Client Info */}

      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-medium mb-3 text-gray-700">Client Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Client Name</span>
            <span className="font-semibold">{invoice.client}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Client Email</span>
            <span className="font-semibold">{invoice.clientEmail}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Phone Number</span>
            <span className="font-semibold">{invoice.clientPhone}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Client ID</span>
            <span className="font-semibold">{invoice.clientId}</span>
          </div>
        </div>
      </div>
      {/* 3. Provider Info */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-medium mb-3 text-gray-700">
          Service Provider Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Provider Name</span>
            <span className="font-medium">{invoice.provider}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Provider Email</span>
            <span className="font-medium">{invoice.providerEmail}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Provider Phone</span>
            <span className="font-medium">{invoice.providerPhone}</span>
          </div>
          <div className="flex mb-1">
            <span className="w-32 text-gray-800">Provider ID</span>
            <span className="font-medium">{invoice.providerId}</span>
          </div>
        </div>
      </div>
      {/* 4. Financial Breakdown */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-medium mb-3 text-gray-700">Financial Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex mb-2">
            <span className="w-32 text-gray-800">Base Price</span>
            <span className="font-medium">{invoice.basePrice}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-32 text-gray-800">Platform Fee</span>
            <span className="font-medium">{invoice.platformFee}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-32 text-gray-800">Provider Net</span>
            <span className="font-medium">{invoice.providerNet}</span>
          </div>
        </div>
      </div>
      {/* 5. Activity Timeline */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">Event Log</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {invoice.activity?.map((a, i) => (
            <li key={i}>
              <span>{a.event}</span>
              <span className="ml-2 text-gray-400 text-xs">{a.date}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* 6. Admin Notes */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">
          📎 Administrative Notes
        </h3>
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add notes about this invoice..."
        />
      </div>
    </div>
  );
}
