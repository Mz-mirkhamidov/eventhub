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
import type { ArtistProfile, Category, PageResponse } from "@/types/api";

export default function ClientArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);
  const [bookingTarget, setBookingTarget] = useState<{ type: "artist"; profile: ArtistProfile } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    apiGet<Category[]>("/api/categories")
      .then((cats) => setCategories(cats.filter((c) => c.type?.toUpperCase() !== "VENUE")))
      .catch(() => setCategories([]));
  }, []);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: "0", size: "20" });
    if (categoryId) params.set("categoryId", categoryId);
    if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    try {
      const data = await apiGet<PageResponse<ArtistProfile>>(`/api/artists/search?${params}`);
      setArtists(data.content ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qidiruv amalga oshmadi");
      setArtists([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, debouncedSearch, debouncedMaxPrice]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <>
      <PageHeader title="San'atkorlar" description="Ijrochilarni qidiring" />
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="min-w-[200px] flex-1">
          <label className="block text-xs font-medium text-slate-500">Ism yoki kalit so&apos;z</label>
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="Masalan: Jasur yoki жасур"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pr-9 pl-3 text-sm"
            />
            {loading && (
              <span
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-[#1A56DB]"
                aria-hidden
              />
            )}
          </div>
        </div>
        <div className="min-w-[180px]">
          <label className="block text-xs font-medium text-slate-500">Kategoriya</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
      ) : artists.length === 0 ? (
        <EmptyState title="San'atkorlar topilmadi" description="Filtrlarni o'zgartirib qayta urinib ko'ring" />
      ) : (
        <div key={`${debouncedSearch}-${categoryId}-${debouncedMaxPrice}`} className="grid gap-4 md:grid-cols-2">
          {artists.map((a, index) => (
            <article
              key={a.id}
              className="animate-search-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {a.profilePhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.profilePhoto} alt="" className="h-36 w-full object-cover" />
              )}
              <div className="p-5">
              <h3 className="font-semibold text-slate-900">{a.fullName}</h3>
              <p className="mt-1 text-sm text-slate-600">{a.categoryName}</p>
              <p className="mt-2 text-sm text-slate-500">{formatPrice(a.pricePerEvent ?? a.pricePerHour)}</p>
              {a.bio && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{a.bio}</p>}
              <button
                type="button"
                onClick={() => {
                  setBookingTarget({ type: "artist", profile: a });
                  setModalOpen(true);
                }}
                className="mt-4 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
              >
                Buyurtma berish
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
