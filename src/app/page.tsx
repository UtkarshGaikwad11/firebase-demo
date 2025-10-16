"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import CrudDashboard from "../components/CrudDashboard";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <CrudDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}