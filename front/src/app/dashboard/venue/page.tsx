"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { apiGet } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import { formatPrice, sumEarnings } from "@/lib/format";
import type { Booking } from "@/types/api";

export default function VenueDashboardPage() {
  const auth = getStoredAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    apiGet<Booking[]>("/api/bookings/my").then(setBookings).catch(() => setBookings([]));
  }, []);

  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <>
      <PageHeader title="Toyxona paneli" description={auth ? `Xush kelibsiz, ${auth.fullName}!` : undefined} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Kutilayotgan bronlar" value={pending} />
        <StatCard label="Jami bronlar" value={bookings.length} />
        <StatCard label="Daromad" value={formatPrice(sumEarnings(bookings))} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/venue/profile" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Profilim</h3>
          <p className="mt-1 text-sm text-slate-600">Profilni tahrirlash</p>
        </Link>
        <Link href="/dashboard/venue/bookings" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Bronlar</h3>
          <p className="mt-1 text-sm text-slate-600">Bronlarni boshqarish</p>
        </Link>
        <Link href="/dashboard/venue/earnings" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Daromad</h3>
          <p className="mt-1 text-sm text-slate-600">Daromad statistikasi</p>
        </Link>
      </div>
    </>
  );
}
