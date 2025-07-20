"use client";
import React, { useEffect } from "react";


import { DataTable } from "./data-table";


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
const serviceRequests = [
  {
    _id: '1',
    title: 'General Health Checkup',
    specialty: 'General',
    city: 'Washington, D.C.',
    numberOfOffers: 2,
    status: 'completed',
    clientName: 'John Doe',
  },
  {
    _id: '2',
    title: 'Heart Health Consultation',
    specialty: 'Cardiology',
    city: 'Cairo',
    numberOfOffers: 5,
    status: 'waiting',
    clientName: 'Sara Ahmed',
  },
  {
    _id: '3',
    title: 'Routine Checkup',
    specialty: 'General',
    city: 'Dubai',
    numberOfOffers: 1,
    status: 'inprogress',
    clientName: 'Ali Hassan',
  },
  {
    _id: '4',
    title: 'Skin Care Advice',
    specialty: 'Dermatology',
    city: 'Riyadh',
    numberOfOffers: 4,
    status: 'completed',
    clientName: 'Mona Youssef',
  },
  {
    _id: '5',
    title: 'Post-Surgery Follow-up',
    specialty: 'General',
    city: 'Alexandria',
    numberOfOffers: 3,
    status: 'waiting',
    clientName: 'Karim Nabil',
  },
];



  return (
    <div className="px-6 ">
      <div className="flex w-full items-end ">
        <h1 className="text-black-200 font-semibold text-xl font-sans  mb-4">Service Requests</h1>
      </div>

      <DataTable   data={serviceRequests} />
    </div>
  );
}
