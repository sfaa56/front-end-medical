import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BiNotification } from "react-icons/bi";
import { CgNotifications } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useClickOutside } from "@/hooks/useClickOutside";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@/features/notification/notificationsSlice";
import { formDataFromCreatedAt, timeAgo } from "@/lib/utils";

function Notification() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, open, () => setOpen(false));

  const dispatch = useDispatch<any>();
  const { items, unreadCount, loading } = useSelector(
    (s: RootState) => s.notifications
  );

    const { user } = useSelector((state: RootState) => state.auth);
  

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <>
      {/* Notifications */}
      <li className="relative list-none" ref={ref}>
        <button
          type="button"
          className="flex items-center relative text-gray-700 hover:text-primary focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
        >
          <IoMdNotificationsOutline size={"22px"} />
          {unreadCount > 0 && (
            <span
              className={`absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white`}
            ></span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded z-50 card">
            <div className="px-4 py-2 border-b">
             <Link href={`/notifications`}> <span className="hover:text-primary font-medium text-secondary text-sm">Notifications {unreadCount > 0 && <span>({unreadCount})</span>}</span></Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul>
                {/* Example static notifications - replace with dynamic content as needed */}
                {items.length === 0 && !loading && (
                  <p className="p-4 text-center text-gray-600">
                    No notifications yet.
                  </p>
                )}
                {loading && (
                  <p className="p-4 text-center text-gray-600">Loading...</p>
                )}
                {items.map((n: any,i) => (
                  <li
                    key={n._id}
                    className={`${i===0 ? "border-t-0 border-b-0" : "border-t-[.1px] border-b-0 border"} px-4 py-3  hover:bg-gray-50 transition  border-x-0 ${
                      !n.seen ? "bg-blue-50" : ""
                    }`}
                  >
                    <Link href="/notifications" className="flex items-center gap-3">
                    
                        {n.senderId?.image?.url ? (  <span className="flex-shrink-0">
                          <img
                            className="w-10 h-8 rounded-full object-cover"
                            alt="Notification"
                            src={n.senderId.image.url}
                          />        </span>
                        ) : (
                          <div className='w-10 h-8 rounded-full  border text-center flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-semibold'>
                            {n.senderId?.firstName?.charAt(0).toUpperCase()}
                          </div>
                        )}
              
                      <div className="w-full">
   

                        <h6 className=" text-gray-800 flex justify-between w-full">
                          <span style={{ fontSize: 12 }} className="font-medium text-sm">
                            {n?.senderId?.role === "provider" && "DR"}{" "}
                            {n?.senderId?.firstName}
                          </span>

                          <span style={{ fontSize: 11 }} className="text-xs text-gray-700 ">
                             {timeAgo(n.createdAt)}
                          </span>
                        </h6>

                        <span style={{ fontSize: 13 }} >{n.message}</span>
                      </div>
                    </Link>
                  </li>
                ))}


              </ul>
            </div>
          </div>
        )}
      </li>
      {/* /Notifications */}
    </>
  );
}

export default Notification;
