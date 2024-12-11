"use client";
import { useRouter } from "next/navigation";
import React from "react";

const NotAuthorized = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-10 text-gray-700">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          403 - Not Authorized
        </h1>
        <p className="text-base mb-6">
          You don’t have permission to access this page. Please ensure you have
          the necessary credentials or contact support if you believe this is a
          mistake.
        </p>
        <button
          onClick={() => handleGoBack()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
