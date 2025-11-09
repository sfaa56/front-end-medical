"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiEye, FiEdit, FiDelete, FiTrash2 } from "react-icons/fi";

import Link from "next/link";
import RejectForm from "@/components/users/rejectForm";
import { deleteUser, approveUser } from "@/features/user/useSlice";
import { IoMdCheckmark } from "react-icons/io";
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
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { FaRegUserCircle } from "react-icons/fa";

// This type is used to define the shape of our data.
export type User = {
  _id?: string;
  image: {
    url?: string;
  };
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  subspecialty?: { name: string }; // 👈 Add this
  isVerified?: boolean;
};

const ActionCell = ({ row }: { row: { original: User } }) => {
  const user = row.original;
  const id = user._id;

  return <div>actions</div>;
};

export const getColumns = (
  roleFilter?: any,
  VerifiedFilter?: boolean
): ColumnDef<User>[] => {

console.log("VerifiedFilter",roleFilter)


  const dispatch = useDispatch<AppDispatch>();
  const approvingUserId = useSelector(
    (state: any) => state.users.approvingUserId
  );

  const handelApproveUser = (userId: string) => {
    dispatch(approveUser(userId));
  };

  const deleteU = async (id) => {

    console.log("id",id)
    try {
      const resultAction = await dispatch(deleteUser({userId:id}));

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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original?.image?.url ? (
            <img
              src={row.original?.image?.url}
              alt={`Image of ${row.original.name}`}
              className="w-12 h-12 rounded-[100%] object-cover"
            />
          ) : (
            <FaRegUserCircle className="w-12 text-3xl" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        return `${firstName} ${lastName}`;
      },
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const status = row.original.isActive;
        const roleClass =
          role === "agency" && status === false ? "text-red-500" : "";
        return <div className={roleClass}>{role}</div>;
      },
    },
    // {
    //   accessorKey: "isActive",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.original.isActive;
    //     return (
    //       <span
    //         className={`px-3 py-1 rounded-full text-xs font-semibold
    //       ${
    //         status === true
    //           ? "bg-green-100 text-green-700"
    //           : "bg-red-200 text-red-600"
    //       }
    //     `}
    //       >
    //         {status ? "Active" : "Inactive"}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "isVerified",
      header:
        roleFilter.role === "provider" || roleFilter.isVerified === false
          ? "isVerified"
          : () => null, // hide header when not needed
      cell: ({ row }) => {
        if (roleFilter.role === "provider" || roleFilter.isVerified === false) {
          const res = row.original.isVerified;
          return (
            <span
              className={`px-1 py-1 rounded-full text-xs font-semibold
            ${res ? "bg-green-100 text-green-700" : "bg-red-200 text-red-600"}
          `}
            >
              {res ? "Verified" : "Not Verified"}
            </span>
          );
        }
        return null; // hide cell when not needed
      },
      enableHiding: true, // still usable for filters
    },
  ];

  // ✅ Add specialty column only for Provider
  // if (roleFilter.role === "Provider" || roleFilter.isVerified === false) {
  //   columns.splice(5, 0, {
  //     accessorKey: "subspecialty",
  //     header: "Specialty",
  //     cell: ({ row }) => {
  //       const specialty = row.original.subspecialty?.name || "N/A";
  //       return <span className="text-gray-600">{specialty}</span>;
  //     },
  //   });
  // }

  // ✅ Add specialty column only for Provider
  // if (roleFilter === "Provider" || VerifiedFilter === false) {
  //   columns.splice(5, 0, {
  //     accessorKey: "isVerified",
  //     header: "isVerified",
  //     cell: ({ row }) => {
  //       const res = row.original.isVerified;
  //       return (
  //         <span
  //           className={`px-1 py-1 rounded-full text-xs font-semibold
  //       ${res ? "bg-green-100 text-green-700" : "bg-red-200 text-red-600"}
  //     `}
  //         >
  //           {res ? "Verified" : "Not Verified"}
  //         </span>
  //       );
  //     },
  //   });
  // }

  columns.push({
    id: "actions",
    cell: ({ row }: { row: { original: User } }) => {
      const user = row.original;
      return roleFilter.isVerified === false ? (
        <div className="flex gap-3 text- items-center justify-center">
          <Link href={`users/approve/${user._id}`}>
            <button
              title="View User"
              className=" hover:cursor-pointer flex items-center gap-2 accept text-blue-600  "
              onClick={() => {
                /* handle view user logic here */
              }}
            >
              <FiEye /> View
            </button>
          </Link>
          <div className="w-px h-4 bg-gray-300"></div>

          <button
            onClick={() => handelApproveUser(user._id ?? "")}
            className="text-green-500 hover:cursor-pointer flex items-center gap-1 accept"
            disabled={approvingUserId === user._id} // disable while loading
          >
            {approvingUserId === user._id ? (
              <svg
                className="animate-spin h-4 w-4 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <>
                <IoMdCheckmark /> Accept
              </>
            )}
          </button>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="reject">
            <RejectForm propertyId={user._id ?? ""} />
          </div>
        </div>
      ) : (
        <div className="text-center gap-2">
          <Link href={`users/view/${user._id}`}>
            <button
              title="View User"
              className="p-2 rounded hover:bg-gray-100 text-blue-600"
              onClick={() => {
                /* handle view user logic here */
              }}
            >
              <FiEye />
            </button>
          </Link>

          <Link href={`users/update/${user._id}`}>
            <button
              title="Update User"
              className="p-2 rounded hover:bg-gray-100 text-green-600"
              onClick={() => {
                /* handle update user logic here */
              }}
            >
              <FiEdit />
            </button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 rounded hover:bg-gray-100 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title="Delete User"
              >
                <FiDelete />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                  <FiTrash2 className="text-2xl text-red-500" />
                </div>
                <AlertDialogTitle className="text-lg font-bold text-red-600">
                  Delete User
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-center text-gray-600 mb-4">
                Are you sure you want to{" "}
                <span className="font-semibold text-red-500">delete</span> user{" "}
                <span className="font-semibold">{user.name}</span>?<br />
                This action cannot be undone.
              </AlertDialogDescription>
              <AlertDialogFooter className="flex justify-center gap-2">
                <AlertDialogCancel
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.stopPropagation();
                    console.log("Deleting user:", user._id);
                    deleteU(user._id);
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  });

  return columns;
};
