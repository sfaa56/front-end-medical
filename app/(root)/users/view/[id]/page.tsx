"use client";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// === Interfaces ===
export interface IFile {
  publicId?: string;
  url?: string;
}
export interface ICity {
  _id: string;
  name: string;
  active: boolean;
}
export interface IDistrict {
  _id: string;
  name: string;
  active: boolean;
  city: ICity;
}
export interface IPostalCode {
  _id: string;
  code: string;
  active: boolean;
  district: IDistrict;
}
export interface ISpecialty {
  _id: string;
  name: string;
}
export interface ISubSpecialty {
  _id: string;
  name: string;
  specialty: ISpecialty;
}
export interface IClinic {
  _id: string;
  name: string;
  postalCode?: IPostalCode;
  day: string[];
  timeFrom: string;
  timeTo: string;
}
export interface IExperience {
  _id: string;
  jobTitle: string;
  hospital: string;
  startYear: number;
  currentlyWorking: boolean;
}
export interface IQualification {
  _id: string;
  title: string;
  institution: string;
  dateObtained: string;
}
export interface IService {
  _id: string;
  title: string;
  place: string;
  price: number;
  priceType: string;
  cuncurncey: string;
  specialty: ISpecialty;
  image?: IFile;
}
export interface IServiceRequest {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  subSpecialty?: ISubSpecialty;
}
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  role: "client" | "provider" | "admin";
  phone: string;
  about?: string;
  isActive: boolean;
  isVerified: boolean;
  isAvailable: boolean;
  experienceYears: number;
  averageRating: number;
  subspecialty: ISubSpecialty[];
  clinics: IClinic[];
  experiences: IExperience[];
  qualifications: IQualification[];
  services: IService[];
  serviceRequests?: IServiceRequest[];
  image?: IFile;
  licenseFile?: IFile;
}

// === Component ===
function UserViewPage() {
  const [tab, setTab] = useState("profile");
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/users/${id}`);
        setUser(res.data); // backend sends { data: user }
      } catch (error) {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading user details...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        User not found.
      </div>
    );

  const fullName = `${user.firstName} ${user.lastName}`;
  const profilePicture = user.image?.url;

  // Role-based tabs
  const tabs =
    user.role === "client"
      ? ["profile", "requests"]
      : ["profile", "clinics", "experiences", "qualifications", "services", "documents"];

  return (
    <div className="mx-6 p-6 bg-white rounded-xl shadow mb-10">
      {/* HEADER */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 overflow-hidden">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            fullName[0]
          )}
        </div>

        <div>
          <div className="text-xl font-bold">{fullName}</div>
          <div className="text-gray-500 capitalize">{user.role}</div>
          <div className="text-sm text-gray-400">
            Status:{" "}
            <span className={user.isActive ? "text-green-600" : "text-red-500"}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <Link href={`/users/update/${user._id}`}>
            <button className="px-3 py-1 rounded text-gray-700 border border-gray-400 hover:bg-gray-100 text-sm">
              Edit Info
            </button>
          </Link>
          <button className="px-3 py-1 rounded border-red-300 border text-red-700 hover:bg-red-50 text-sm">
            {user.isActive ? "Block" : "Unblock"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            className={`pb-2 px-2 border-b-2 ${
              tab === t
                ? "border-secondary text-secondary font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {tab === "profile" && (
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-medium w-36 inline-block">Full Name:</span>{" "}
              {fullName}
            </div>
            <div>
              <span className="font-medium w-36 inline-block">Email:</span>{" "}
              {user.email}
            </div>
            <div>
              <span className="font-medium w-36 inline-block">Phone:</span>{" "}
              {user.phone}
            </div>
            <div>
              <span className="font-medium w-36 inline-block">Gender:</span>{" "}
              {user.gender}
            </div>
            <div>
              <span className="font-medium w-36 inline-block">Verified:</span>{" "}
              {user.isVerified ? "Yes" : "No"}
            </div>
          </div>

          {user.role === "provider" && (
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-medium w-40 inline-block">Experience:</span>{" "}
                {user.experienceYears} years
              </div>
              <div>
                <span className="font-medium w-40 inline-block">Specialties:</span>{" "}
                {user.subspecialty.map((s) => s.name).join(", ") || "—"}
              </div>
              <div>
                <span className="font-medium w-40 inline-block">Availability:</span>{" "}
                {user.isAvailable ? "Available" : "Unavailable"}
              </div>
              <div>
                <span className="font-medium w-40 inline-block">About:</span>{" "}
                {user.about || "—"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CLIENT REQUESTS TAB */}
      {tab === "requests" && user.role === "client" && (
        <div>
          <h3 className="font-semibold mb-3">Service Requests</h3>
          {user.serviceRequests?.length ? (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Specialty</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {user.serviceRequests.map((req) => (
                  <tr key={req._id} className="border-b">
                    <td className="p-2">{req.title}</td>
                    <td className="p-2">
                      {req.subSpecialty?.specialty?.name ?? "-"}
                    </td>
                    <td className="p-2 capitalize">{req.status}</td>
                    <td className="p-2">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No service requests found.</p>
          )}
        </div>
      )}

      {/* PROVIDER-ONLY SECTIONS */}
      {user.role === "provider" && (
        <>
          {tab === "clinics" && (
            <div>
              <h3 className="font-semibold mb-3">Clinics</h3>
              {user.clinics.length === 0 ? (
                <p className="text-gray-500">No clinics added.</p>
              ) : (
                <ul className="space-y-3">
                  {user.clinics.map((c) => (
                    <li key={c._id} className="border p-3 rounded-md">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-gray-600">
                        {c.postalCode?.district.name},{" "}
                        {c.postalCode?.district.city.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {c.day.join(", ")} — {c.timeFrom} → {c.timeTo}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "experiences" && (
            <div>
              <h3 className="font-semibold mb-3">Experiences</h3>
              {user.experiences.length === 0 ? (
                <p className="text-gray-500">No experiences found.</p>
              ) : (
                <ul className="space-y-3">
                  {user.experiences.map((e) => (
                    <li key={e._id} className="border p-3 rounded-md">
                      <div className="font-medium">{e.jobTitle}</div>
                      <div className="text-sm text-gray-500">{e.hospital}</div>
                      <div className="text-sm text-gray-400">
                        Since {e.startYear}{" "}
                        {e.currentlyWorking && "(Currently Working)"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "qualifications" && (
            <div>
              <h3 className="font-semibold mb-3">Qualifications</h3>
              {user.qualifications.length === 0 ? (
                <p className="text-gray-500">No qualifications found.</p>
              ) : (
                <ul className="space-y-3">
                  {user.qualifications.map((q) => (
                    <li key={q._id} className="border p-3 rounded-md">
                      <div className="font-medium">{q.title}</div>
                      <div className="text-sm text-gray-500">
                        {q.institution}
                      </div>
                      <div className="text-sm text-gray-400">
                        Obtained:{" "}
                        {new Date(q.dateObtained).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "services" && (
            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              {user.services.length === 0 ? (
                <p className="text-gray-500">No services found.</p>
              ) : (
                <ul className="space-y-3">
                  {user.services.map((s) => (
                    <li
                      key={s._id}
                      className="border p-3 rounded-md flex justify-between items-start"
                    >
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-gray-500">{s.place}</div>
                        <div className="text-sm text-gray-400">
                          {s.price} {s.cuncurncey} / {s.priceType}
                        </div>
                      </div>
                      {s.image?.url && (
                        <img
                          src={s.image.url}
                          alt="service"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "documents" && (
            <div>
              <h3 className="font-semibold mb-3">Documents</h3>
              {user.licenseFile?.url ? (
                <ul>
                  <li>
                    <a
                      href={user.licenseFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      License Document
                    </a>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-500">No documents uploaded.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserViewPage;
