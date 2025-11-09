"use client";
import React, { useEffect } from "react";
import { DataTable } from "./data-table";
import columns from "./columns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchComplaints } from "@/features/complaint/complaintSlice";
import { toast } from "sonner";
import Loading from "@/components/Loading";

// const complaints = [
//   {
//     id: "C-1001",
//     sender: "Ahmed Hassan",
//     receiver: "Mohamed Tarek",
//     type: "Complaint",
//     status: "Pending",
//     date: "2025-06-07",
//     message: "The provider did not arrive on time.",
//   },
//   {
//     id: "C-1002",
//     sender: "Mona Samir",
//     receiver: "Youssef Adel",
//     type: "Inquiry",
//     status: "Resolved",
//     date: "2025-06-06",
//     message: "Can I reschedule the service appointment?",
//   },
//   {
//     id: "C-1003",
//     sender: "Heba Ali",
//     receiver: "Omar Nabil",
//     type: "Suggestion",
//     status: "Rejected",
//     date: "2025-06-05",
//     message: "I suggest adding a window cleaning service.",
//   },
//   {
//     id: "C-1004",
//     sender: "Khaled Saad",
//     receiver: "Samy Maher",
//     type: "Complaint",
//     status: "In Progress",
//     date: "2025-06-04",
//     message: "The service was performed very poorly.",
//   },
//   {
//     id: "C-1005",
//     sender: "Sara Mohammed",
//     receiver: "Hany Refaat",
//     type: "Inquiry",
//     status: "Resolved",
//     date: "2025-06-03",
//     message: "Are there any discounts on weekly services?",
//   },
// ];



function Page() {
  
  const {items,loading,meta}=useSelector((state:RootState)=>state.complaints);


  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
    const fetchRequests = async () => {
      try {
        const resultAction = await dispatch(
          fetchComplaints({ page: 1, limit: 10 })
        );

        if (fetchComplaints.fulfilled.match(resultAction)) {
          console.log(
            "ServiceRequests fetched successfully:",
            resultAction.payload
          );
        } else {
          console.error("Failed to fetch users:", resultAction.error.message);
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        toast.error("something went wrong");
      }
    };

    fetchRequests();
  }, []);
  return (
    <div className="px-6">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans  mb-4">
          Complaints & Support
        </h1>
      </div>

{ <DataTable columns={columns} data={items} meta={meta}  />}

     
    </div>
  );
}

export default Page;
