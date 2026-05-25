"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { VENUE_NAV } from "@/lib/dashboard";

export default function VenueDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="VENUE" navItems={VENUE_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
