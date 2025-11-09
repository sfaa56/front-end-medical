"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

import UserFormSection from "@/components/updateUser/BasicInfoForm";
import ProfessionalInfoForm from "@/components/updateUser/ProfessionalInfoForm";
import ClinicInfoForm from "@/components/updateUser/ClinicsOld";
import ClinicForm from "@/components/updateUser/Clinic";
import Availability from "@/components/updateUser/Availability";
// import ClinicInfoForm from "@/components/updateUser/Clinics";
// import ProfessionalInfoForm from "@/components/updateUser/ProfessionalInfoForm";

function Pagee() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient(`/users/${id}`);
        setUser(res.data);
      } catch (error) {
        toast.error("Something went wrong while fetching user");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const renderContent = () => {
    if (!user) return null;

    // ✅ If client → only show basic form
    if (user.role === "client") {
      return <UserFormSection />;
    }

    // ✅ If provider → show tabs
    switch (activeTab) {
      case "general":
        return <UserFormSection />;
      case "ProfessionalInfoForm":
        return <ProfessionalInfoForm />;
      case "ClinicInfoForm":
        return <ClinicForm />;
      case "Availability":
        return <Availability />;

      default:
        return <UserFormSection />;
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">Loading user...</div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-10">
        User not found or invalid ID.
      </div>
    );

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <nav
        className="flex items-center text-sm text-gray-500 mb-6"
        aria-label="Breadcrumb"
      >
        <Link href={"/users"}>
          <span className="hover:underline cursor-pointer text-secondary">
            Users List
          </span>
        </Link>
        <FiChevronRight className="mx-2" />
        <span className="font-semibold text-gray-700">Update</span>
      </nav>

      {/* ✅ Tabs only for providers */}
      {user.role === "provider" && (
        <div className="flex gap-4 text-sm mt-4 flex-wrap">
          {[
            { key: "general", label: "General Info" },
            { key: "ProfessionalInfoForm", label: "Professional Info" },
            { key: "ClinicInfoForm", label: "Clinics" },
            { key: "Availability", label: "Weekly Availability" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md hover:text-white hover:bg-primary py-1 px-2 border hover:border-primary transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Render the form section */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}

export default Pagee;
