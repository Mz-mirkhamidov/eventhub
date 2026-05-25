"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BloggerOrderModal from "@/components/dashboard/BloggerOrderModal";
import BloggerProfileModal from "@/components/dashboard/BloggerProfileModal";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import SearchSkeleton from "@/components/dashboard/SearchSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { apiGet } from "@/lib/api";
import { formatFollowers, formatPlatformLabel, formatPrice, formatRating } from "@/lib/format";
import type { BloggerProfile, ContentFormat, PageResponse, SocialPlatform } from "@/types/api";

const PLATFORMS: { value: SocialPlatform | ""; label: string }[] = [
  { value: "", label: "Barcha" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE", label: "YouTube" },
];

const FORMAT_LABELS: Record<ContentFormat, string> = {
  STORY: "Story",
  POST: "Post",
  REEL: "Reel",
  VIDEO: "Video",
  REVIEW: "Review",
};

export default function ClientBloggersPage() {
  const router = useRouter();
  const [bloggers, setBloggers] = useState<BloggerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const debouncedMinFollowers = useDebounce(minFollowers, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);
  const debouncedCategory = useDebounce(category, 300);
  const debouncedPlatform = useDebounce(platform, 300);

  const [profileBlogger, setProfileBlogger] = useState<BloggerProfile | null>(null);
  const [orderBlogger, setOrderBlogger] = useState<BloggerProfile | null>(null);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: "0", size: "20" });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (debouncedPlatform) params.set("platform", debouncedPlatform);
    if (debouncedMinFollowers) params.set("minFollowers", debouncedMinFollowers);
    if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
    if (debouncedCategory.trim()) params.set("category", debouncedCategory.trim());
    try {
      const data = await apiGet<PageResponse<BloggerProfile>>(`/api/bloggers/search?${params}`);
      setBloggers(data.content ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qidiruv amalga oshmadi");
      setBloggers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedPlatform, debouncedMinFollowers, debouncedMaxPrice, debouncedCategory]);

  useEffect(() => {
    fetchBloggers();
  }, [fetchBloggers]);

  function openOrderFromProfile() {
    if (profileBlogger) {
      setOrderBlogger(profileBlogger);
      setProfileBlogger(null);
    }
  }

  return (
    <>
      <PageHeader title="Bloggerlar" description="Influencerlarni qidiring" />
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="min-w-[140px] flex-1">
          <label className="block text-xs font-medium text-slate-500">Qidiruv</label>
          <input
            type="text"
            placeholder="Ism..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="min-w-[130px]">
          <label className="block text-xs font-medium text-slate-500">Platforma</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {PLATFORMS.map((p) => (
              <option key={p.value || "all"} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-slate-500">Min. obunachi</label>
          <input type="number" min={0} value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-slate-500">Kategoriya</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-slate-500">Maks. narx</label>
          <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <SearchSkeleton count={3} />
      ) : bloggers.length === 0 ? (
        <EmptyState title="Bloggerlar topilmadi" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bloggers.map((b, index) => (
            <article
              key={b.id}
              className="animate-search-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4 p-4">
                {b.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.profilePhoto} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">👤</div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{b.fullName}</h3>
                  {b.categories?.length > 0 && (
                    <p className="mt-0.5 text-xs text-[#1A56DB]">{b.categories.join(", ")}</p>
                  )}
                  <p className="mt-1 text-xs text-amber-600">⭐ {formatRating(b.rating)}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 px-4 pb-4">
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {b.platforms?.map((p, i) => (
                    <li key={i}>
                      {formatPlatformLabel(p.platform)}: {formatFollowers(p.followerCount)} obunachi
                    </li>
                  ))}
                </ul>
                {b.contentFormats?.length > 0 && (
                  <ul className="mt-2 space-y-0.5 border-t border-slate-50 pt-2 text-sm text-slate-700">
                    {b.contentFormats.map((f) => (
                      <li key={f.format} className="flex justify-between">
                        <span>{FORMAT_LABELS[f.format] ?? f.format}</span>
                        <span className="font-medium">{formatPrice(f.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileBlogger(b)}
                    className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Batafsil ko&apos;rish
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderBlogger(b)}
                    className="flex-1 rounded-lg bg-[#1A56DB] py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
                  >
                    Buyurtma berish
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <BloggerProfileModal
        open={!!profileBlogger}
        onClose={() => setProfileBlogger(null)}
        blogger={profileBlogger}
        onOrder={openOrderFromProfile}
      />
      <BloggerOrderModal
        open={!!orderBlogger}
        onClose={() => setOrderBlogger(null)}
        blogger={orderBlogger}
        onSuccess={() => router.push("/dashboard/client/bookings?success=1")}
      />
    </>
  );
}
