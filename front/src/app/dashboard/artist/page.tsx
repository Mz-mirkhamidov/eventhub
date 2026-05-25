"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { apiGet } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import { formatPrice, sumEarnings } from "@/lib/format";
import type { Booking } from "@/types/api";

export default function ArtistDashboardPage() {
  const auth = getStoredAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    apiGet<Booking[]>("/api/bookings/my").then(setBookings).catch(() => setBookings([]));
  }, []);

  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <>
      <PageHeader title="San'atkor paneli" description={auth ? `Xush kelibsiz, ${auth.fullName}!` : undefined} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Keluvchi bronlar" value={pending} />
        <StatCard label="Jami bronlar" value={bookings.length} />
        <StatCard label="Daromad" value={formatPrice(sumEarnings(bookings))} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/artist/profile" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Profilim</h3>
          <p className="mt-1 text-sm text-slate-600">Profilni tahrirlash</p>
        </Link>
        <Link href="/dashboard/artist/bookings" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Buyurtmalar</h3>
          <p className="mt-1 text-sm text-slate-600">Bronlarni boshqarish</p>
        </Link>
        <Link href="/dashboard/artist/barter" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Barter</h3>
          <p className="mt-1 text-sm text-slate-600">Barter takliflari</p>
        </Link>
      </div>
    </>
  );
}
