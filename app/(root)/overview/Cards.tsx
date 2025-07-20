import Link from 'next/link';
import React from 'react'
import { FaUsers, FaStore, FaDollarSign } from "react-icons/fa";
import { MdOutlineAssignment, MdArrowUpward } from "react-icons/md";

function Cards() {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 ">

  


      {/* Users Card */}
      <Link href={"/users"}>
      <div  className="bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3 hover:shadow-xl transition relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-xl font-semibold">1,250</p>
     
          </div>
        </div>
        {/* Extra content */}
        <div className="flex justify-between mt-2 text-xs text-gray-600 z-10">
          <div>
            <span className="font-semibold text-green-600">1,100</span> Active
          </div>
          <div>
            <span className="font-semibold text-gray-400">150</span> Inactive
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt- z-10">
          <div className="bg-blue-400 h-2 rounded-full" style={{ width: "88%" }}></div>
        </div>
        <span className="block text-xs text-gray-400 mt-1 z-10">88% active users</span>
        <span className="block text-xs text-gray-400 mt-1 z-10">Updated 2 min ago</span>
        <div className="absolute right-0 top-0 w-20 h-20 bg-blue-50 rounded-full opacity-40 -z-0"></div>
      </div>
      </Link>


      {/* Providers Card */}
      <Link href={"/users"}>
      <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3 hover:shadow-xl transition relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            <FaStore className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Providers</h3>
            <p className="text-xl font-semibold">340</p>
       
          </div>
        </div>
        {/* Extra content */}
        <div className="flex justify-between mt-2 text-xs text-gray-600 z-10">
          <div>
            <span className="font-semibold text-purple-600">280</span> Verified
          </div>
          <div>
            <span className="font-semibold text-gray-400">60</span> Pending
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2  z-10">
          <div className="bg-purple-400 h-2 rounded-full" style={{ width: "82%" }}></div>
        </div>
        <span className="block text-xs text-gray-400 mt-1 z-10">82% verified providers</span>
        <span className="block text-xs text-gray-400 mt-1 z-10">Updated 5 min ago</span>
        <div className="absolute right-0 top-0 w-20 h-20 bg-purple-50 rounded-full opacity-40 -z-0"></div>
      </div>
      </Link>

      {/* Orders Card */}
      <Link href={"/ServiceRequests"}>
      <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3 z-10">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <MdOutlineAssignment className="text-2xl" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Service Requests</h3>
        </div>
        <div className="text-sm space-y-1 z-10">
          <div className="flex justify-between text-gray-700">
            <span>Completed</span>
            <span className="font-semibold">890</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>In Progress</span>
            <span className="font-semibold">120</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Canceled</span>
            <span className="font-semibold">40</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mt-4 z-10">
          <div className="bg-green-400 h-2 rounded-full" style={{ width: "80%" }}></div>
        </div>
        <span className="block text-xs text-gray-400 mt-2 z-10">Last order 10 min ago</span>
        <div className="absolute right-0 top-0 w-20 h-20 bg-green-50 rounded-full opacity-40 -z-0"></div>
      </div>
      </Link>

      {/* Revenue Card */}
     

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition relative overflow-hidden">
     <Link className='' href={"/Payments/transaction"}>  
       <div className="flex items-center gap-4 z-10">
          <FaDollarSign className="text-3xl" />
          <div>
            <h3 className="text-sm font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold">$42,300</p>
            <div className="flex items-center gap-1 text-xs text-green-200 mt-1">
              <MdArrowUpward />
              <span>7.8% this month</span>
            </div>
          </div>
        </div>
        <span className="block text-xs text-indigo-100 mt-4 z-10">Updated just now</span>
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -z-0"></div> </Link>
      </div> 
    </div>
  
  )
}

export default Cards