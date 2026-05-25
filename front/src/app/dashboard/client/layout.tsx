"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CLIENT_NAV } from "@/lib/dashboard";

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="CLIENT" navItems={CLIENT_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
