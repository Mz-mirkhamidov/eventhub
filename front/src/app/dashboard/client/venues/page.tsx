"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/dashboard/BookingModal";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import SearchSkeleton from "@/components/dashboard/SearchSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { apiGet } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { PageResponse, VenueProfile } from "@/types/api";

export default function ClientVenuesPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<VenueProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const debouncedMinCapacity = useDebounce(minCapacity, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);
  const [bookingTarget, setBookingTarget] = useState<{ type: "venue"; profile: VenueProfile } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: "0", size: "20" });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (debouncedMinCapacity) params.set("minCapacity", debouncedMinCapacity);
    if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
    try {
      const data = await apiGet<PageResponse<VenueProfile>>(`/api/venues/search?${params}`);
      setVenues(data.content ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qidiruv amalga oshmadi");
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedMinCapacity, debouncedMaxPrice]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return (
    <>
      <PageHeader title="Toyxonalar" description="Mos toyxonalarni qidiring va tanlang" />
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative min-w-[200px] flex-1">
          <label className="block text-xs font-medium text-slate-500">Ism yoki manzil</label>
          <input
            type="text"
            placeholder="Nomi yoki manzil bo'yicha qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 py-2 pr-9 pl-3 text-sm"
          />
          {loading && (
            <span
              className="pointer-events-none absolute top-[calc(50%+10px)] right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-[#1A56DB]"
              aria-hidden
            />
          )}
        </div>
        <div className="min-w-[120px]">
          <label className="block text-xs font-medium text-slate-500">Min. sig&apos;im</label>
          <input
            type="number"
            min={0}
            placeholder="Kishi"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="min-w-[120px]">
          <label className="block text-xs font-medium text-slate-500">Maks. narx</label>
          <input
            type="number"
            min={0}
            placeholder="So'm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <SearchSkeleton count={3} />
      ) : venues.length === 0 ? (
        <EmptyState title="Toyxonalar topilmadi" description="Filtrlarni o'zgartirib qayta urinib ko'ring" />
      ) : (
        <div key={`${debouncedSearch}-${debouncedMinCapacity}-${debouncedMaxPrice}`} className="grid gap-4 md:grid-cols-2">
          {venues.map((v, index) => (
            <article
              key={v.id}
              className="animate-search-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {v.coverPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.coverPhoto} alt="" className="h-36 w-full object-cover" />
              )}
              <div className="p-5">
              <h3 className="font-semibold text-slate-900">{v.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{v.address}</p>
              <p className="mt-2 text-sm text-slate-500">
                Sig&apos;im: {v.capacity} · {formatPrice(v.pricePerHour)}/soat
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingTarget({ type: "venue", profile: v });
                  setModalOpen(true);
                }}
                className="mt-4 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
              >
                Bron qilish
              </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        target={bookingTarget}
        onSuccess={() => router.push("/dashboard/client/bookings?success=1")}
      />
    </>
  );
}
