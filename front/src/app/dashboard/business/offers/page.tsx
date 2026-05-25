"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { BarterStatusBadge } from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiGet, apiPost } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { BarterOffer, BarterRequestItem, SocialPlatform } from "@/types/api";

const PLATFORMS: SocialPlatform[] = ["INSTAGRAM", "TIKTOK", "YOUTUBE", "TELEGRAM"];

export default function BusinessOffersPage() {
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [requests, setRequests] = useState<BarterRequestItem[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productValue, setProductValue] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("INSTAGRAM");
  const [minFollowers, setMinFollowers] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiGet<BarterOffer[]>("/api/barter/offers/mine")
      .then(setOffers)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Yuklash amalga oshmadi");
        setOffers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRequests(offerId: string) {
    if (expandedId === offerId) {
      setExpandedId(null);
      setRequests([]);
      return;
    }
    setExpandedId(offerId);
    setRequestsLoading(true);
    try {
      const data = await apiGet<BarterRequestItem[]>(`/api/barter/offers/${offerId}/requests`);
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiPost("/api/barter/offers", {
        title,
        description,
        productValue: Number(productValue),
        platform,
        minFollowers: minFollowers ? Number(minFollowers) : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setTitle("");
      setDescription("");
      setProductValue("");
      setMinFollowers("");
      setExpiresAt("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yaratish amalga oshmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Takliflarim"
        description="Barter takliflarini boshqaring"
        action={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
          >
            {showForm ? "Yopish" : "Yangi taklif"}
          </button>
        }
      />
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <input type="text" required placeholder="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <textarea required placeholder="Tavsif" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-3">
            <input type="number" required min={0} placeholder="Mahsulot qiymati" value={productValue} onChange={(e) => setProductValue(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input type="number" min={0} placeholder="Min. obunachilar" value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={submitting} className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
            {submitting ? "Yaratilmoqda..." : "Yaratish"}
          </button>
        </form>
      )}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : offers.length === 0 ? (
        <EmptyState title="Takliflar yo'q" description="Yangi barter taklifi yarating" />
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <article key={o.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{o.title}</h3>
                <BarterStatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{o.description}</p>
              <p className="mt-2 text-sm font-medium text-[#1A56DB]">{formatPrice(o.productValue)} · {o.platform}</p>
              <button
                type="button"
                onClick={() => toggleRequests(o.id)}
                className="mt-3 text-sm font-medium text-[#1A56DB] hover:underline"
              >
                {expandedId === o.id ? "So'rovlarni yashirish" : "So'rovlarni ko'rish"}
              </button>
              {expandedId === o.id && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {requestsLoading ? (
                    <p className="text-sm text-slate-600">Yuklanmoqda...</p>
                  ) : requests.length === 0 ? (
                    <p className="text-sm text-slate-500">So&apos;rovlar yo&apos;q</p>
                  ) : (
                    <ul className="space-y-3">
                      {requests.map((r) => (
                        <li key={r.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                          <p className="font-medium text-slate-900">{r.requesterName}</p>
                          <p className="text-slate-600">
                            {r.followerCount != null ? `${r.followerCount} obunachi` : "—"} ·{" "}
                            <a href={r.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#1A56DB] hover:underline">
                              Profil
                            </a>
                          </p>
                          {r.message && <p className="mt-1 text-slate-500">{r.message}</p>}
                          <BarterStatusBadge status={r.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
