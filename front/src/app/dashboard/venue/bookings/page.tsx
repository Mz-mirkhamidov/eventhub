"use client";

import { useCallback, useEffect, useState } from "react";
import BookingList from "@/components/dashboard/BookingList";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiGet } from "@/lib/api";
import type { Booking } from "@/types/api";

export default function VenueBookingsPage() {
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
      <PageHeader title="Bronlar" description="Toyxona bronlari" />
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : (
        <BookingList bookings={bookings} onRefresh={load} showActions="both" />
      )}
    </>
  );
}
