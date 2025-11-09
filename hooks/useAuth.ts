import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = (requiredRole?: string) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const token = stored.accessToken;
    const expiry = stored.expiry;

    // 🧠 1. Check if no token or expired
    if (!token || !expiry || Date.now() > expiry) {
      localStorage.removeItem("user");
      router.push("/sign-in");
      return;
    }

    // 🧠 2. Check role if required
    if (requiredRole && stored.user?.role !== requiredRole) {
      router.push("/Auth/sign-in");
      return;
    }
  }, [router, requiredRole]);
};

export default useAuth;
