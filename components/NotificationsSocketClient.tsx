"use client";

import React from "react";
import useNotificationsSocket from "@/features/notification/hooks/useNotificationsSocket";

/**
 * Small client component that invokes the client-only hook.
 * Render this inside a Client Component context (e.g. inside ReduxProvider in layout).
 */
export default function NotificationsSocketClient(): React.ReactElement | null {
  
  // hook runs on the client and can access window / WebSocket / Redux
  useNotificationsSocket();
  return null; // no UI
}