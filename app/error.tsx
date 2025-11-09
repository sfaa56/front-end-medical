"use client";

import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center space-y-6 bg-white shadow-lg rounded-2xl p-8 max-w-md"
      >
        <div className="bg-red-100 p-4 rounded-full">
          <FiAlertTriangle className="text-red-500 text-5xl" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Something went wrong</h1>
        <p className="text-gray-500">
          {error.message || "An unexpected error occurred. Please try again later."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-2 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}