"use client";
import useAuth from "@/hooks/useAuth";
import React from "react";

export default function AuthClient(): React.ReactElement | null {
  useAuth();
  return null;
}
