"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { BarterStatusBadge } from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiGet, apiPut } from "@/lib/api";
import type { BarterRequestItem } from "@/types/api";

export default function BusinessRequestsPage() {
  const [requests, setRequests] = useState<BarterRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiGet<BarterRequestItem[]>("/api/barter/requests/incoming")
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleConfirm(id: string) {
    setBusyId(id);
    setError("");
    try {
      await apiPut(`/api/barter/requests/${id}/confirm`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tasdiqlash amalga oshmadi");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="So'rovlar" description="Kelgan barter so'rovlari" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : requests.length === 0 ? (
        <EmptyState title="So'rovlar yo'q" />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <article key={r.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{r.requesterName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{r.offerTitle}</p>
                </div>
                <BarterStatusBadge status={r.status} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Obunachilar</dt>
                  <dd className="font-medium text-slate-900">{r.followerCount ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Profil</dt>
                  <dd>
                    <a href={r.profileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1A56DB] hover:underline break-all">
                      {r.profileUrl}
                    </a>
                  </dd>
                </div>
                {r.message && (
                  <div>
                    <dt className="text-slate-500">Xabar</dt>
                    <dd className="mt-1 text-slate-700">{r.message}</dd>
                  </div>
                )}
              </dl>
              {r.status === "REQUESTED" && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => handleConfirm(r.id)}
                  className="mt-4 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
                >
                  Tasdiqlash
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
