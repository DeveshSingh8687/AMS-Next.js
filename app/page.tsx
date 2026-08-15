'use client'
import React, { useState, useEffect } from "react";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
// import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(true);
  const isAuthenticated = true;

  useEffect(() => {
    const load = async () => {
      setLoading(false);
    };
    load();
  }, []);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    );
  }

  return role === "admin" || role === "superadmin" ? (
    <AdminDashboard />
  ) : (
    <EmployeeDashboard />
  );
}