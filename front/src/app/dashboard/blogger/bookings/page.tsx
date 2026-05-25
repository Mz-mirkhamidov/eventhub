"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import BookingList from "@/components/dashboard/BookingList";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiGet } from "@/lib/api";
import type { Booking } from "@/types/api";

export default function BloggerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    apiGet<Booking[]>("/api/bookings/my")
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageHeader title="Buyurtmalar" description="Mijozlardan kelgan so'rovlar" />
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : bookings.length === 0 ? (
        <EmptyState title="Buyurtmalar yo'q" />
      ) : (
        <BookingList bookings={bookings} onRefresh={load} showActions="both" />
      )}
    </>
  );
}
