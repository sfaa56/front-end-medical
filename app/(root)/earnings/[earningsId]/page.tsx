"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

// Dummy data for demonstration
const dummyEarnings = [
  {
    id: "EARN-001",
    invoiceId: "INV-2024-001",
    providerId: "PR-001",
    providerName: "Ahmed Mohamed",
    clientId: "CL-001",
    clientName: "Sara Ali",
    serviceId: "SRV-001",
    service: "Web Design",
    amount: 800,
    status: "pending",
    createdAt: "2025-06-01",
    availableAt: "2025-06-04",
    finishedAt: "2025-06-02",
    invoiceStatus: "Paid",
    confirmationMethod: "Automatic",
    activity: [
      { event: "Invoice created", date: "2025-06-01" },
      { event: "Payment received", date: "2025-06-01" },
      { event: "Service finished", date: "2025-06-02" },
    ],
    adminNotes: "",
    invoiceAmount: 1000,
    platformFee: 200,
    providerNet: 800,
    withdrawalStatus: "not yet withdrawn",
    withdrawalId: "WD-1023",
  },
  // ...more
];

export default function EarningDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // Find earning by id param
  const earning = dummyEarnings.find((e) => e.id === params.earningsId) || dummyEarnings[0];

  const [earningStatus, setEarningStatus] = useState(earning?.status || "pending");
  const [activity, setActivity] = useState(earning?.activity || []);
  const [adminNotes, setAdminNotes] = useState(earning?.adminNotes || "");

  // Manual Release Handler
  const handleManualRelease = () => {
    setEarningStatus("available");
    setActivity([
      ...activity,
      {
        event: "The manager issued the earnings manually",
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  // Freeze Handler
  const handleFreeze = () => {
    const reason = prompt("Enter reason for freezing earnings:");
    if (reason) {
      setEarningStatus("pending");
      setActivity([
        ...activity,
        {
          event: `Earnings were frozen: ${reason}`,
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
  };

  return (
    <div className="px-6 mb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-800 mb-4" aria-label="Breadcrumb">
        <Link href={"/overview"}>
          <span className="hover:underline cursor-pointer">Home</span>
        </Link>
        <FiChevronRight className="mx-2" />
        <Link href={"/payments/earnings"}>
          <span className="hover:underline cursor-pointer">Earnings</span>
        </Link>
        <FiChevronRight className="mx-2" />
        <span>{earning.id}</span>
      </nav>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Earning Details
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {earning?.invoiceStatus}
        </span>
      </h2>

      {/* Main Info Card */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex">
            <span className="w-44 text-gray-800">Earning ID:</span>
            <span className="font-medium">{earning.id}</span>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Invoice ID:</span>
            <Link
              href={`/payments/invoice/${earning.invoiceId}`}
              className="text-secondary underline"
            >
              {earning.invoiceId}
            </Link>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Service:</span>
            <Link
              href={`/services/${earning.serviceId}`}
              className="text-secondary underline"
            >
              {earning.service}
            </Link>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Client:</span>
            <Link
              href={`/clients/${earning.clientId}`}
              className="text-secondary underline"
            >
              {earning.clientName}
            </Link>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Provider:</span>
            <Link
              href={`/providers/${earning.providerId}`}
              className="text-secondary underline"
            >
              {earning.providerName}
            </Link>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Service Finished At:</span>
            <span>{earning.finishedAt}</span>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Earnings Status:</span>
            <span className="font-medium">
              {earningStatus === "available" ? "Released" : "Pending"}
            </span>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Payment Date:</span>
            <span>{earning.createdAt}</span>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Expected Release Date:</span>
            <span>{earning.availableAt}</span>
          </div>
          <div className="flex">
            <span className="w-44 text-gray-800">Confirmation Method:</span>
            <span>{earning.confirmationMethod}</span>
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-medium mb-3 text-gray-700">Item Value</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex">
            <span className="w-56 text-gray-800">Total Invoice Amount:</span>
            <span className="font-medium">{earning.invoiceAmount} EGP</span>
          </div>
          <div className="flex">
            <span className="w-56 text-gray-800">Platform Commission (20%):</span>
            <span className="font-medium">{earning.platformFee} EGP</span>
          </div>
          <div className="flex">
            <span className="w-56 text-gray-800">Provider Net Profit:</span>
            <span className="font-medium">{earning.providerNet} EGP</span>
          </div>
          <div className="flex">
            <span className="w-56 text-gray-800">Withdrawal Status:</span>
            <span className="font-medium">
              {earning.withdrawalStatus === "not yet withdrawn" ? (
                <span className="text-red-600">❌ Not yet withdrawn</span>
              ) : (
                <span className="text-green-600">✅ Withdrawn</span>
              )}
            </span>
          </div>
          <div className="flex">
            <span className="w-56 text-gray-800">Withdrawal ID:</span>
            <span className="font-medium">{earning.withdrawalId}</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">
          Activity Timeline
        </h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {activity.map((a, i) => (
            <li key={i}>
                <div className="flex">
              <span className="w-32">{a.event}</span>
              <span className="ml-2 text-gray-600 text-xs">{a.date}</span></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Admin Notes */}
      <div className="mb-4 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">
          Administrative Notes
        </h3>
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add notes about this earning..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        {earningStatus !== "available" && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
            onClick={handleManualRelease}
          >
            Manual Release
          </button>
        )}
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
          onClick={handleFreeze}
        >
          Freeze Earnings
        </button>

      </div>
    </div>
  );
}