"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { apiGet } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import type { Booking } from "@/types/api";

export default function ClientDashboardPage() {
  const auth = getStoredAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    apiGet<Booking[]>("/api/bookings/my")
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);

  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <>
      <PageHeader
        title="Mijoz paneli"
        description={auth ? `Xush kelibsiz, ${auth.fullName}!` : undefined}
      />
      <Link
        href="/plan"
        className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1A56DB] to-[#3b82f6] p-6 text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl"
      >
        <div>
          <h2 className="text-lg font-bold">Tadbir rejalashtirish</h2>
          <p className="mt-1 text-sm text-blue-100">6 qadamda to&apos;y, tug&apos;ilgan kun yoki korporativ tadbir rejasini tuzing</p>
        </div>
        <span className="shrink-0 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold">Boshlash →</span>
      </Link>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Jami bronlar" value={bookings.length} />
        <StatCard label="Kutilayotgan" value={pending} />
        <StatCard label="Platforma" value="Eventhub.uz" hint="Toyxona va san'atkorlar" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/client/venues"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB] hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">Toyxonalar</h3>
          <p className="mt-1 text-sm text-slate-600">Mos toyxonalarni qidiring</p>
        </Link>
        <Link
          href="/dashboard/client/artists"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB] hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">San'atkorlar</h3>
          <p className="mt-1 text-sm text-slate-600">Ijrochilarni toping</p>
        </Link>
        <Link
          href="/dashboard/client/bookings"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB] hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-900">Bronlarim</h3>
          <p className="mt-1 text-sm text-slate-600">Bronlaringizni boshqaring</p>
        </Link>
      </div>
    </>
  );
}
