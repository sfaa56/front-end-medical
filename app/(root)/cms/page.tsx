"use client";
import Terms from "@/components/cms/terms";
import About from "@/components/cms/aboutUs";
import React, { useState } from "react";
import CMSSettings from "@/components/cms/contactUs";

function Page() {
  const [activePage, setActivePage] = useState("terms");

  return (
    <div className="flex flex-col w-full -mt-4 px-6">
      {/* Navigation Bar - Fixed Position */}
      <nav className="relative flex space-x-2 w-fit self-start ml-[1.5%]">
        
        <button
          onClick={() => setActivePage("terms")}
          className={`absolute left- px-4 py-1 font-medium rounded-t-lg border-[1px] border-b-0 transition-all
            ${
              activePage === "terms"
                ? " bg-white text-black border-gray-300    border-b-[10px] border-b-white"
                : "text-black  border-gray-300 hover:bg-white"
            }`}
        >
          Terms
        </button>

        <button
          onClick={() => setActivePage("about")}
          className={`absolute px-4 py-1 font-medium rounded-t-lg border-[1px] border-b-0  left-20  transition-all 
            ${
              activePage === "about"
                ? " bg-white text-black border-gray-300   border-b-[10px] border-b-white"
                : "text-black  border-gray-300 hover:bg-white "
            }`}
        >
          About
        </button>


        <button
          onClick={() => setActivePage("contact")}
          className={`absolute px-4 py-1 font-medium rounded-t-lg border-[1px] border-b-0  left-[165px]  transition-all 
            ${
              activePage === "contact"
                ? " bg-white text-black border-gray-300   border-b-[10px] border-b-white"
                : "text-black  border-gray-300 hover:bg-white "
            }`}
        >
          Contact
        </button>
      </nav>

      {/* Content Wrapper (Ensures No Layout Shift) */}
      <div className="w-full min-h-[300px] flex justify-center items-start">
      {activePage === "terms" ? <Terms /> : activePage === "about" ? <About /> : activePage === "contact" ? <CMSSettings /> : null}

      </div>
    </div>
  );
}

export default Page;