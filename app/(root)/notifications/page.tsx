"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchNotifications,
  markAllAsSeen,
  markAsSeen,
} from "@/features/notification/notificationsSlice";
import { formDataFromCreatedAt, timeAgo } from "@/lib/utils";

import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function NotificationsPage() {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { items, loading, unreadCount } = useSelector(
    (s: RootState) => s.notifications
  );

  useEffect(() => {
    // Fetch notifications and mark all as read on mount
    const initPage = async () => {
      await dispatch(fetchNotifications());
      await dispatch(markAllAsSeen());
    };
    initPage();
  }, [dispatch]);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleNotificationClick = async (notification: any) => {
    // Mark as seen when clicked
    if (!notification.seen) {
      try {
        await dispatch(markAsSeen(notification._id)).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as seen:", err);
      }
    }

    const basePath =
      (user as any)?.user.role === "provider"
        ? "/doctor-dashboard"
        : "/patient-dashboard";

    const offersUrl =
      (user as any)?.user?.role === "provider" ? "/requests" : "/requests/view";

    const bookingUrl =
      (user as any)?.user?.role === "provider"
        ? "/doctor-dashboard/requests"
        : "/patient-dashboard/PendingAppointments";

    // Navigate based on notification type
    switch (notification.type) {
      case "provider_registeration":
        router.push(`/users/view/${notification.senderId._id}`);
        break;
      case "complaint":
        router.push(`/complaints`);
        break;

      default:
        console.warn("Unknown notification type:", notification.type);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto ">
        <div className="flex justify-between items-center mb-4 ">
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mt-4 mb-5" />

        {loading ? (
          <div className="text-center py-8">
            <Loading />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500">No notifications yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors
                  ${notification.seen ? "bg-white" : "bg-blue-50"} 
                  hover:bg-gray-50`}
              >
                <div className="flex items-start gap-4">
                  {notification.senderId?.image?.url ? (
                    <Image
                      width={400}
                      height={400}
                      src={notification.senderId.image.url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
                      {notification.senderId?.firstName
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">
                        {notification.senderId?.role === "provider" && "DR"}{" "}
                        {notification.senderId?.firstName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
