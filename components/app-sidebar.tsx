"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { BarChart2, Briefcase, House, Mail, Settings } from "lucide-react";
// import { Mail } from "lucide-react";
import { Package2 } from "lucide-react";
import { MapPinned } from "lucide-react";
import { Users } from "lucide-react";
import { CreditCard } from "lucide-react";

import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

import { FaBriefcase, FaRegFlag } from "react-icons/fa6";
import { Building } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { IoPhoneLandscapeSharp } from "react-icons/io5";
import { FaCreativeCommonsShare } from "react-icons/fa";

import { MdOutlineLibraryBooks } from "react-icons/md";
import { TbUserQuestion } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/overview",
    icon: <LayoutDashboard />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <Users />,
  },


  {
    title: "Complaints & Support",
    url: "/complaints",
    icon: <FaRegFlag />,
  },
  {
    title: "Payments",
    url: "/payments/transaction",
    icon: <CreditCard />,
  },
    {
    title: "Reports & Analytics",
    url: "/analytics",
    icon: <BarChart2 />,
  },




];


 

const serviceSection = [
  {
    title: "Service Requests",
    url: "/ServiceRequests",
    icon: <MdOutlinePostAdd />,
  },
  {
    title: "Categories",
    url: "/categoriesAndServices",
    icon: <BiCategoryAlt />,
  },
    {
    title: "Specialties",
    url: "/specialties",
    icon:  <Briefcase />
  },
  {
    title: "Bidding Settings",
    url: "/biddingSettings",
    icon: <FaCreativeCommonsShare />,
  },
];


const contentManagementSection = [
  {
    title: "CMS Pages",
    url: "/cms",
    icon: <IoPhoneLandscapeSharp />,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: <MdOutlineLibraryBooks />,
  },
];


const settings =[
  {
    title:"General Settings",
    url:"/settings",
    icon: <Settings />,
  },
  {
    title: "Cities",
    url: "/cities",
    icon: <MapPinned />,
  },
  
]

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const pathname = usePathname();

  const handleItemClick = (title: string) => {
    setActiveItem(title);
  };



  const pathMap = {
    "/overview": "Overview",
    "/users": "Users",
    "/ServiceRequests": "Service Requests",
    "/categoriesAndServices": "Categories",
    "/specialties": "Specialties",
    "/pending": "Pending",
    "/cities": "Cities",
    "/payments": "Payments",
    "/complaints": "Complaints & Support",
    "/biddingSettings": "Bidding Settings",
    "/settings":"General Settings",

    "/analytics":"Reports & Analytics",

    "/cms": "CMS Pages",
    "/blogs": "Blogs",
  };

  useEffect(() => {
    const foundKey = Object.keys(pathMap).find((key) => pathname.includes(key));
    if (foundKey) {
      setActiveItem(pathMap[foundKey as keyof typeof pathMap]);
    }
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>

     <div className="flex justify-center w-full mb-4">
      <img className="w-[55%] h-auto" src="logo/primary.jpeg" alt="123" />
     </div>


    

             {/* Other menu items */}
        <div className="flex flex-col gap-1">

          
          {items
    
            .map((i, key) => (
              <Link href={i.url || "#"} key={key} className="block">
                <div className="relative w-full px-4">
                  {activeItem === i.title && (
                    <div className="rounded-tr-md rounded-br-md w-1 h-6 bg-secondary  absolute top-[6px] left-0 transition-all"></div>
                  )}

                  <Button
                    variant={"sidebar"}
                    key={key}
                    className={` items-center justify-start gap-3 text-gray-700 ${
                      activeItem === i.title
                        ? " text-secondary bg-secondary bg-opacity-10 font-sans font-semibold"
                        : "font-normal"
                    }`}
                    onClick={() => handleItemClick(i.title)}
                  >
                    <span
                      className={`${
                        activeItem === i.title ? "text-secondary " : ""
                      }`}
                    >
                      {i.icon}
                    </span>
                    <span className="te">{i.title}</span>
                  </Button>
                </div>
              </Link>
            ))}
        </div>

        {/* Services Section */}
        <div className="mt-3">
          <div className="px-8 pb-2  text-xs  text-gray-500  uppercase tracking-wider">
            Services
          </div>
          <div className="flex flex-col gap-1">
            {serviceSection.map((i, key) => (
              <Link href={i.url || "#"} key={key} className="block">
                <div className="relative w-full px-4">
                  {activeItem === i.title && (
                    <div className="rounded-tr-md rounded-br-md w-1 h-6 bg-secondary absolute top-[6px] left-0 transition-all"></div>
                  )}
                  <Button
                    variant={"sidebar"}
                    className={`items-center justify-start gap-3 text-gray-700 ${
                      activeItem === i.title
                        ? " text-secondary bg-secondary bg-opacity-10 font-sans font-semibold"
                        : "font-normal"
                    }`}
                    onClick={() => handleItemClick(i.title)}
                  >
                    <span
                      className={`${
                        activeItem === i.title ? "text-secondary " : ""
                      }`}
                    >
                      {i.icon}
                    </span>
                    <span>{i.title}</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>

               {/* Content Management Section */}
        <div className=" border-gray-200  mt-4">
          <div className="px-8 pb-2 text-xs text-gray-500 uppercase tracking-wider">
            Content Management
          </div>
          <div className="flex flex-col gap-1">
            {contentManagementSection.map((i, key) => (
              <Link href={i.url || "#"} key={key} className="block">
                <div className="relative w-full px-4">
                  {activeItem === i.title && (
                    <div className="rounded-tr-md rounded-br-md w-1 h-6 bg-secondary absolute top-[6px] left-0 transition-all"></div>
                  )}
                  <Button
                    variant={"sidebar"}
                    className={`items-center justify-start gap-3 text-gray-700 ${
                      activeItem === i.title
                        ? " text-secondary bg-secondary bg-opacity-10 font-sans font-semibold"
                        : "font-normal"
                    }`}
                    onClick={() => handleItemClick(i.title)}
                  >
                    <span
                      className={`${
                        activeItem === i.title ? "text-secondary " : ""
                      }`}
                    >
                      {i.icon}
                    </span>
                    <span>{i.title}</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>



               {/* Settings Section */}

          <div className=" border-gray-200  mt-4">
          <div className="px-8 pb-2 text-xs text-gray-500 uppercase tracking-wider">
            Settings
          </div>
          <div className="flex flex-col gap-1">
            {settings.map((i, key) => (
              <Link href={i.url || "#"} key={key} className="block">
                <div className="relative w-full px-4">
                  {activeItem === i.title && (
                    <div className="rounded-tr-md rounded-br-md w-1 h-6 bg-secondary absolute top-[6px] left-0 transition-all"></div>
                  )}
                  <Button
                    variant={"sidebar"}
                    className={`items-center justify-start gap-3 text-gray-700 ${
                      activeItem === i.title
                        ? " text-secondary bg-secondary bg-opacity-10 font-sans font-semibold"
                        : "font-normal"
                    }`}
                    onClick={() => handleItemClick(i.title)}
                  >
                    <span
                      className={`${
                        activeItem === i.title ? "text-secondary " : ""
                      }`}
                    >
                      {i.icon}
                    </span>
                    <span>{i.title}</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>


        

        

   
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
