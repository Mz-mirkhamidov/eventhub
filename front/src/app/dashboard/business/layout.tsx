"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BUSINESS_NAV } from "@/lib/dashboard";

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="BUSINESS" navItems={BUSINESS_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
