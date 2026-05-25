"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import BarterApplyModal from "@/components/dashboard/BarterApplyModal";
import { BarterStatusBadge } from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiGet } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { BarterOffer } from "@/types/api";

const PLATFORM_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  TELEGRAM: "Telegram",
};

export default function ArtistBarterPage() {
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BarterOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiGet<BarterOffer[]>("/api/barter/offers")
      .then(setOffers)
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="Barter" description="Biznes takliflariga ariza bering" />
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : offers.length === 0 ? (
        <EmptyState title="Takliflar yo'q" description="Hozircha ochiq barter takliflari mavjud emas" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => (
            <article key={o.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{o.title}</h3>
                <BarterStatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{o.description}</p>
              <p className="mt-2 text-sm text-slate-500">
                {o.businessName} · {PLATFORM_LABELS[o.platform] ?? o.platform}
              </p>
              <p className="mt-1 text-sm font-medium text-[#1A56DB]">{formatPrice(o.productValue)}</p>
              {o.minFollowers != null && (
                <p className="mt-1 text-xs text-slate-500">Min. {o.minFollowers} obunachi</p>
              )}
              {o.status === "OPEN" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(o);
                    setModalOpen(true);
                  }}
                  className="mt-4 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
                >
                  Ariza yuborish
                </button>
              )}
            </article>
          ))}
        </div>
      )}
      <BarterApplyModal
        offer={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />
    </>
  );
}
