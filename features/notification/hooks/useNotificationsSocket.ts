"use client"
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { pushNotification } from "../notificationsSlice";
import { RootState } from "@/store/store";

export default function useNotificationsSocket() {
  const { user } = useSelector((state: RootState) => state.auth);

    const token = user?.token || (user as any)?.accessToken || (user as any)?.token;

  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    // تقدر تحط token في query أو auth header في handshake (هنا بسيط: userId)
    const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SOCKET, {
      query: { userId: (user as any)?.user.id },
      auth: { token } // optional
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("notification:new", (notif) => {
      console.log("notification hereeeee",notif)
      dispatch(pushNotification(notif));
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
       socket.off("notification:new");
      socket.disconnect();
    };
  }, [token, user, dispatch]);

  return socketRef.current;
}
