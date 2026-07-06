"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import DashboardHome from "@/components/admin/DashboardHome";
import DataManagement from "@/components/admin/DataManagement";

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  if (activeTab === "dashboard") {
    return <DashboardHome />;
  }

  return <DataManagement tab={activeTab} />;
}
