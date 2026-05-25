"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BLOGGER_NAV } from "@/lib/dashboard";

export default function BloggerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="BLOGGER" navItems={BLOGGER_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
