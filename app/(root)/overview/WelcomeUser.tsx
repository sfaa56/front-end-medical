"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function WelcomeUser() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <p className="text-xl">
      welcome, {user?.name || "........."}
    </p>
  );
}