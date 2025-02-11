import React from "react";
import { useLoading } from "./LoadingContext";

const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
