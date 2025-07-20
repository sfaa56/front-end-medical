"use client"
import Link from "next/link";
import React, { useState } from "react";

// Dummy user data (replace with real data from API)
const user = {
  type: "provider", // or "provider"
  fullName: "Sarah Al-Farsi",
  email: "sarah@example.com",
  phone: "+966 555 123 456",
  role: "Client",
  status: "Active",
  dateJoined: "2024-01-15",
  lastLogin: "2024-06-09 09:30",
  // Client-specific
  requestsCount: 12,
  requests: [
    { id: "REQ-001", status: "Completed", date: "2024-05-01" },
    { id: "REQ-002", status: "Pending", date: "2024-06-01" },
    { id: "REQ-003", status: "Canceled", date: "2024-06-05" },
  ],
  complaints: [
    { id: "CMP-001", subject: "Late arrival", date: "2024-05-10" },
  ],
  ratings: [
    { provider: "Provider A", rating: 5, comment: "Great service!" },
  ],
  // Provider-specific
  specialties: ["Plumbing", "Electrical"],
  categories: ["Home Services", "Electrical"],
  regions: ["Riyadh", "Jeddah"],
  availability: "Online",
  avgRating: 4.8,
  completedJobs: 45,
  revenue: 12000,
  approvalStatus: "Approved",
  documents: [
    { name: "ID Card", url: "#" },
    { name: "License", url: "#" },
  ],
  profilePicture: "",
};

function UserViewPage() {
  const [tab, setTab] = useState("profile");

  return (
    <div className=" mx-6 p-6 bg-white rounded-xl shadow mb-10">
      {/* User Info Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            user.fullName[0]
          )}
        </div>
        <div>
          <div className="text-xl font-bold">{user.fullName}</div>
          <div className="text-gray-500">{user.role}</div>
          <div className="text-sm text-gray-400">Status: <span className={user.status === "Active" ? "text-green-600" : "text-red-500"}>{user.status}</span></div>
        </div>
        <div className="ml-auto flex gap-2">
       <Link href={"/users/update/555"}>     <button className="px-3 py-1 rounded  text-gray-700 border border-gray-400 hover:bg-gray-100 text-sm">Edit Info</button></Link>
        <button className="px-3 py-1 rounded border-red-300 border text-red-700 hover:bg-red-50 text-sm">{user.status === "Active" ? "Block" : "Unblock"}</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-2 border-b-2 ${tab === "profile" ? "border-secondary text-secondary font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
        <button
          className={`pb-2 px-2 border-b-2 ${tab === "requests" ? "border-secondary text-secondary font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("requests")}
        >
          Requests
        </button>
        <button
          className={`pb-2 px-2 border-b-2 ${tab === "complaints" ? "border-secondary text-secondary font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("complaints")}
        >
          Complaints
        </button>
        <button
          className={`pb-2 px-2 border-b-2 ${tab === "ratings" ? "border-secondary text-secondary font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("ratings")}
        >
          Ratings
        </button>
        {user.type === "provider" && (
          <button
            className={`pb-2 px-2 border-b-2 ${tab === "documents" ? "border-secondary text-secondary font-semibold" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("documents")}
          >
            Documents
          </button>
        )}
      </div>

      {/* Tab Content */}
      {tab === "profile" && (
        <div className=" flex gap-60">


          <div className="flex flex-col gap-3">
          <div className="flex"><span className="font-medium w-36">Full Name</span> {user.fullName}</div>
          <div className="flex"><span className="font-medium w-36">Email</span> {user.email}</div>
          <div className="flex"><span className="font-medium w-36">Phone</span> {user.phone}</div>
          <div className="flex"><span className="font-medium w-36">Role</span> {user.role}</div>
          <div className="flex"><span className="font-medium w-36">Status:</span> {user.status}</div>
          <div className="flex"><span className="font-medium w-36">Date Joined</span> {user.dateJoined}</div>
          <div className="flex"><span className="font-medium w-36">Last Login</span> {user.lastLogin}</div>
          </div>


          {user.type === "provider" && (
            <div className="flex flex-col gap-3">
              <div className="flex"> <span className="font-medium  w-40">Specialties</span> {user.specialties.join(", ")} </div>
              <div className="flex"><span className="font-medium w-40">Categories</span> {user.categories.join(", ")}</div>
              <div className="flex"><span className="font-medium w-40">Regions</span> {user.regions.join(", ")}</div>
              <div className="flex"><span className="font-medium w-40">Availability</span> {user.availability}</div>
              <div className="flex"><span className="font-medium w-40">Avg. Rating</span> {user.avgRating}</div>
              <div className="flex"><span className="font-medium w-40">Completed Jobs</span> {user.completedJobs}</div>
              <div className="flex"><span className="font-medium w-40">Revenue</span> ${user.revenue}</div>
              <div className="flex"><span className="font-medium w-40">Approval Status</span> {user.approvalStatus}</div>
            </div>
          )}
          {user.type === "client" && (
            <>
              <div><span className="font-medium">Requests Made:</span> {user.requestsCount}</div>
            </>
          )}
        </div>   
      )}

      {tab === "requests" && (
        <div>
          <h3 className="font-semibold mb-2">Request History</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {user.requests.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "complaints" && (
        <div>
          <h3 className="font-semibold mb-2">Complaints</h3>
          {user.complaints.length === 0 ? (
            <div className="text-gray-500">No complaints filed.</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {user.complaints.map((c) => (
                <li key={c.id}>
                  <span className="font-medium">{c.subject}</span> — {c.date}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "ratings" && (
        <div>
          <h3 className="font-semibold mb-2">Ratings</h3>
          {user.ratings.length === 0 ? (
            <div className="text-gray-500">No ratings yet.</div>
          ) : (
            <ul className="space-y-2">
              {user.ratings.map((r, i) => (
                <li key={i}>
                  <span className="font-medium">{r.provider}</span>: {r.rating} ★ — {r.comment}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "documents" && user.type === "provider" && (
        <div>
          <h3 className="font-semibold mb-2">Documents</h3>
          {user.documents.length === 0 ? (
            <div className="text-gray-500">No documents uploaded.</div>
          ) : (
            <ul className="space-y-2">
              {user.documents.map((doc, i) => (
                <li key={i}>
                  <a href={doc.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default UserViewPage;