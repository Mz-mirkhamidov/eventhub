"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { apiGet } from "@/lib/api";
import { formatPrice, sumEarnings } from "@/lib/format";
import type { Booking } from "@/types/api";

export default function VenueEarningsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Booking[]>("/api/bookings/my")
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const total = sumEarnings(bookings);

  return (
    <>
      <PageHeader title="Daromad" description="Tasdiqlangan va yakunlangan bronlar bo'yicha" />
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Jami daromad" value={formatPrice(total)} />
          <StatCard label="Tasdiqlangan" value={confirmed} />
          <StatCard label="Yakunlangan" value={completed} />
        </div>
      )}
    </>
  );
}
