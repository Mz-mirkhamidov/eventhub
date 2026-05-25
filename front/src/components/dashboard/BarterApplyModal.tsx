"use client";

import { FormEvent, useState } from "react";
import { apiPost } from "@/lib/api";
import type { BarterOffer } from "@/types/api";

export default function BarterApplyModal({
  offer,
  open,
  onClose,
  onSuccess,
}: {
  offer: BarterOffer | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [followerCount, setFollowerCount] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !offer) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiPost(`/api/barter/offers/${offer!.id}/request`, {
        followerCount: Number(followerCount),
        profileUrl,
        message: message || null,
      });
      setFollowerCount("");
      setProfileUrl("");
      setMessage("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "So'rov yuborilmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-label="Yopish" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Barter so&apos;rovi</h2>
        <p className="mt-1 text-sm text-slate-600">{offer.title}</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Obunachilar soni</label>
            <input
              type="number"
              required
              min={0}
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Profil havolasi</label>
            <input
              type="url"
              required
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Xabar</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Bekor
            </button>
            <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-[#1A56DB] py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
