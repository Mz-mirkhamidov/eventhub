"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ADMIN_NAV } from "@/lib/dashboard";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="ADMIN" navItems={ADMIN_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
