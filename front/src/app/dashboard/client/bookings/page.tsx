"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingList from "@/components/dashboard/BookingList";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiGet } from "@/lib/api";
import type { Booking } from "@/types/api";

export default function ClientBookingsPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    apiGet<Booking[]>("/api/bookings/my")
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="Bronlarim" description="Barcha bronlaringiz" />
      {success === "1" && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Bron muvaffaqiyatli yaratildi!
        </div>
      )}
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : (
        <BookingList
          bookings={bookings}
          onRefresh={load}
          showActions="cancel-only"
          cancelPendingOnly
        />
      )}
    </>
  );
}
