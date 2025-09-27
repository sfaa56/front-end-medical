"use client";

import BasicInfo from "@/components/profile/BasicInfo";
import Password from "@/components/profile/Password";

import React, { useState } from "react";

function AdminProfilePage() {
  const [activityLog] = useState([
    { action: "Logged in", date: "2024-06-09 10:00" },
    { action: "Changed settings", date: "2024-06-08 18:22" },
    { action: "Exported report", date: "2024-06-07 14:10" },
  ]);

  return (
    <div className=" mx-6 p-8 bg-white rounded-xl shadow mb-10">
      <h1 className="text-gray-600 font-semibold text-xl font-sans  mb-6">
        Admin Profile
      </h1>

      <div className="space-y-4">
        {/* Basic Info */}
        <BasicInfo />

        {/* Change Password Section */}

        <Password />

        {/* Activity Log Section */}
        <section className="border-t pt-6">
          <h2 className="font-semibold mb-2 text-secondary">Activity Log</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {activityLog.map((log, i) => (
              <li key={i}>
                <span className="font-medium">{log.action}</span> — {log.date}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminProfilePage;
