"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ARTIST_NAV } from "@/lib/dashboard";

export default function ArtistDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="ARTIST" navItems={ARTIST_NAV}>
      <div className="p-6 lg:p-8">{children}</div>
    </DashboardLayout>
  );
}
