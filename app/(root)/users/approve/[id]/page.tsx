"use client";
import { useEffect, useState } from "react";
import { getUserById } from "@/features/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { approveUser, deleteUser } from "@/features/user/useSlice";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import RejectForm from "@/components/users/rejectForm";
import { useParams } from "next/navigation";

export default function UserViewPage() {
  const { id } = useParams();

  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("profile");
  const dispatch = useDispatch<AppDispatch>();
  const approvingUserId = useSelector(
    (state: any) => state.users.approvingUserId
  );

  const router = useRouter();

  useEffect(() => {
    getUserById(id)
      .then(setUser)
      .catch((err) => console.error("Error fetching user:", err));
  }, [id]);

  if (!user)
    return (
      <div>
        <div className="w-full flex justify-center items-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-secondary rounded-full" />
          <span className="ml-2 text-secondary">Loading...</span>
        </div>
      </div>
    );

  const isLoading = approvingUserId === id;

  const handelApproveUser = async (userId: string) => {
    const resultAction = await dispatch(approveUser(userId));

    if (approveUser.fulfilled.match(resultAction)) {
      router.push("/users"); // redirect after success
    }
  };

  const deleteU = async (id, reason) => {
    try {
      const resultAction = await dispatch(deleteUser(id, reason));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("User deleted successfully");
      } else {
        const errorMessage =
          (resultAction as any)?.error?.message || "Unknown error";
        console.error("Failed to delete user:", errorMessage);
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="mx-6 p-6 bg-white rounded-xl shadow mb-10">
      {/* User Info Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 overflow-hidden">
          {user.image?.url ? (
            <img
              src={user.image.url}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.firstName[0]
          )}
        </div>
        <div>
          <div className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-gray-500">{user.role}</div>
          <div className="text-sm text-gray-400">
            Status:{" "}
            <span className={user.isActive ? "text-green-600" : "text-red-500"}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => handelApproveUser(user._id ?? "")}
            className="px-3 py-1 flex items-center rounded border-green-300 border text-green-700 hover:bg-green-50 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...
              </>
            ) : (
              "Approve"
            )}
          </button>

          <div className="reject">
            <RejectForm propertyId={user._id ?? ""} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {["profile", "clinics", "availability", "documents"].map((t) => (
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

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="grid grid-cols-2 gap-10">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            <div className="flex">
              <span className="font-medium w-36">Full Name</span>{" "}
              {user.firstName} {user.lastName}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Email</span> {user.email}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Phone</span> {user.phone}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Gender</span> {user.gender}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Role</span> {user.role}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            <div className="flex">
              <span className="font-medium w-36">Experience</span>{" "}
              {user.experienceYears} years
            </div>
            <div className="flex">
              <span className="font-medium w-36">Subspecialty</span>{" "}
              {user.subspecialty?.name}
            </div>
            <div className="flex">
              <span className="font-medium w-36">License Number</span>{" "}
              {user.licenseNumber}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Verified</span>{" "}
              {user.isVerified ? "Yes" : "No"}
            </div>
            <div className="flex">
              <span className="font-medium w-36">Created At</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Clinics Tab */}
      {tab === "clinics" && (
        <div>
          <h3 className="font-semibold mb-4">Clinics</h3>
          {user.clinics?.length > 0 ? (
            <div className="space-y-6">
              {user.clinics.map((clinic: any, idx: number) => (
                <div
                  key={clinic._id || idx}
                  className="border p-4 rounded-lg bg-gray-50 shadow-sm"
                >
                  <p>
                    <strong>Name : </strong> {clinic.name}
                  </p>
                  <p>
                    <strong>Time :</strong> {clinic.timeFrom} - {clinic.timeTo}
                  </p>
                  <p>
                    <strong>Days :</strong> {clinic.day?.join(", ")}
                  </p>
                  {clinic.postalCode && (
                    <p>
                      <strong>Location :</strong>{" "}
                      {clinic.postalCode.district?.name},{" "}
                      {clinic.postalCode.district?.city.name} <br />
                      <strong>Postal Code :</strong> {clinic.postalCode.code}
                    </p>
                  )}

                  {/* Clinic Photos */}
                  {clinic.clinicPhoto && (
                    <div className="flex gap-2 mt-2">
                      <img
                        src={clinic.clinicPhoto.url}
                        alt="Clinic"
                        className="w-28 h-20 rounded object-cover shadow"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No clinics available.</div>
          )}
        </div>
      )}

      {/* Availability Tab */}
      {tab === "availability" && (
        <div>
          <h3 className="font-semibold mb-4">Availability</h3>
          {user.availability ? (
            <ul className="space-y-2 ml-4">
              {Object.entries(user.availability).map(
                ([day, { from, to }]: any, i) => (
                  <li key={i} className="flex gap-2">
                    <span className=" font-medium">{day} :</span>
                    <span>
                      {from} - {to}
                    </span>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="text-gray-500">No availability data.</div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {tab === "documents" && (
        <div>
          <h3 className="font-semibold mb-2">Documents</h3>
          {user.licenseFile ? (
            <ul className="space-y-3">
              <li>
                <a
                  href={user.licenseFile.url}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License File
                </a>
              </li>
              <li>
                <img
                  src={user.licenseFile.url}
                  alt="License Preview"
                  className="w-52 border rounded shadow"
                />
              </li>
            </ul>
          ) : (
            <div className="text-gray-500">No documents uploaded.</div>
          )}
        </div>
      )}
    </div>
  );
}
