"use client";
import React, { useEffect, useState } from "react";

import { DataTable } from "./data-table";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchServiceRequests } from "@/features/ServiceRequests/ServiceRequestsSlice";

export default function Page() {
  //   const {cities, setCities} = useSharedState()

  //   useEffect(() => {
  //     const fetchCities = async () => {
  //       try {
  //         const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/cities`)
  //         const data = await response.json()
  //         setCities(data)
  //       } catch (error) {
  //         console.error('Error fetching cities:', error)
  //       }
  //     }

  //     fetchCities()
  //   }, [])

  const { serviceRequests, isLoading, meta } = useSelector(
    (state: RootState) => state.serviceRequests
  );

  const dispatch = useDispatch<AppDispatch>();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const resultAction = await dispatch(
          fetchServiceRequests({ page: 1, limit: 10 })
        );

        if (fetchServiceRequests.fulfilled.match(resultAction)) {
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
      } finally {
        setFetching(false);
      }
    };

    fetchRequests();
  }, []);

  // const serviceRequests = [
  //   {
  //     _id: '1',
  //     title: 'General Health Checkup',
  //     specialty: 'General',
  //     city: 'Washington, D.C.',
  //     numberOfOffers: 2,
  //     status: 'completed',
  //     clientName: 'John Doe',
  //   },
  //   {
  //     _id: '2',
  //     title: 'Heart Health Consultation',
  //     specialty: 'Cardiology',
  //     city: 'Cairo',
  //     numberOfOffers: 5,
  //     status: 'waiting',
  //     clientName: 'Sara Ahmed',
  //   },
  //   {
  //     _id: '3',
  //     title: 'Routine Checkup',
  //     specialty: 'General',
  //     city: 'Dubai',
  //     numberOfOffers: 1,
  //     status: 'inprogress',
  //     clientName: 'Ali Hassan',
  //   },
  //   {
  //     _id: '4',
  //     title: 'Skin Care Advice',
  //     specialty: 'Dermatology',
  //     city: 'Riyadh',
  //     numberOfOffers: 4,
  //     status: 'completed',
  //     clientName: 'Mona Youssef',
  //   },
  //   {
  //     _id: '5',
  //     title: 'Post-Surgery Follow-up',
  //     specialty: 'General',
  //     city: 'Alexandria',
  //     numberOfOffers: 3,
  //     status: 'waiting',
  //     clientName: 'Karim Nabil',
  //   },
  // ];

  return (
    <div className="px-6 ">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans  mb-4">
          Service Requests
        </h1>
      </div>

      {fetching ? (
        <div className="w-full flex justify-center items-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-secondary rounded-full" />
          <span className="ml-2 text-secondary">Loading...</span>
        </div>
      ) : serviceRequests ? (
        <DataTable meta={meta} data={serviceRequests} />
      ) : (
        <></>
      )}
    </div>
  );
}
