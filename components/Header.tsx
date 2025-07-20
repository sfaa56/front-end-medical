"use client";

import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { FaUserCircle } from "react-icons/fa";

import { MdKeyboardArrowDown } from "react-icons/md";
import { useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logoutUser } from "@/features/auth/authSlice";
import {  useRouter } from "next/navigation";

// ...other imports...

function Header() {
  // const user = {
  //   name: "John Doe",
  //   avatar: "", // URL or leave empty for icon fallback
  // };

  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full border-b-2 py-4 px-[25px]  bg-white">
      <SidebarTrigger />

      <nav className="flex items-center gap-8">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <FiBell
            className="text-xl text-gray-500 cursor-pointer hover:text-secondary transition-colors duration-200"
            onClick={() => setOpenNotif((v) => !v)}
          />
          {openNotif && (
            <div
              className="absolute right-0 top-8 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 text-sm
                transition-all duration-300 ease-out
                opacity-100 scale-100 translate-y-0
                animate-dropdown"
              style={{
                animation: openNotif
                  ? "dropdownIn 0.3s cubic-bezier(0.4,0,0.2,1)"
                  : "",
              }}
            >
              <div className="px-4 py-2 font-semibold border-b">
                Notifications
              </div>
              <div className="max-h-60 overflow-y-auto">
                {/* Example notifications */}
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-md">
                  No new notifications
                </div>
                {/* Map your notifications here */}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative flex gap-3 items-center" ref={menuRef}>
          {user?.image?.url ? (
            <img
              src={user?.image?.url ||""}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          )}

           {/* <FaUserCircle className="w-8 h-8 text-gray-400" /> */}

          <button
            className="flex items-center gap-1 text-black text-sm font-medium focus:outline-none"
            onClick={() => setOpen((v) => !v)}
          >
            {user?.name||"...."}

            <MdKeyboardArrowDown
              className={`text-lg transform transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
  className={`absolute -right-4 top-8 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 text-sm transition-all duration-300 ease-out transform origin-top
    ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
  `}
            >
              <Link href={"/profile"}> 
              <button className="block w-full text-left px-4 py-2 hover:transition-transform hover:translate-x-1 hover:text-secondary transition-all duration-500 ">
                Profile
              </button></Link>

           <button className="block w-full text-left px-4 py-2 hover:transition-transform hover:translate-x-1 hover:text-secondary transition-all duration-500 ">
                Messages
              </button>

<Link href={"/settings"}>
              <button className="block w-full text-left px-4 py-2 hover:transition-transform hover:translate-x-1 hover:text-secondary transition-all duration-500  ">
                Settings
              </button>
    </Link>

              <div className=" h-[1px] mx-[18px] bg-gray-200"></div>

              <button onClick={async()=>{await dispatch(logoutUser()); router.push('/sign-in')}} className="block w-full text-left px-4 py-2 hover:transition-transform hover:translate-x-1 hover:text-secondary transition-all duration-500  ">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
