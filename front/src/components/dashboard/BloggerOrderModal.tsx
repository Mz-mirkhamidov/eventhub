"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import { formatPlatformLabel, formatPrice } from "@/lib/format";
import type { BloggerProfile, ContentFormat } from "@/types/api";

const FORMAT_LABELS: Record<ContentFormat, string> = {
  STORY: "Story",
  POST: "Post",
  REEL: "Reel",
  VIDEO: "Video",
  REVIEW: "Review",
};

export default function BloggerOrderModal({
  open,
  onClose,
  blogger,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  blogger: BloggerProfile | null;
  onSuccess?: () => void;
}) {
  const [contentFormat, setContentFormat] = useState<ContentFormat | "">("");
  const [publicationDate, setPublicationDate] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formats = blogger?.contentFormats ?? [];

  const selectedPrice = useMemo(() => {
    if (!contentFormat) return null;
    return formats.find((f) => f.format === contentFormat)?.price ?? null;
  }, [contentFormat, formats]);

  useEffect(() => {
    if (!open) {
      setContentFormat("");
      setPublicationDate("");
      setBriefDescription("");
      setReferenceLink("");
      setError("");
    }
  }, [open]);

  if (!open || !blogger) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const current = blogger;
    if (!current) return;
    if (!contentFormat || selectedPrice == null || !publicationDate || !briefDescription.trim()) {
      setError("Barcha majburiy maydonlarni to'ldiring");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiPost("/api/bookings", {
        orderType: "BLOGGER_ORDER",
        bloggerId: current.id,
        publicationDate,
        contentFormat,
        briefDescription: briefDescription.trim(),
        referenceLink: referenceLink.trim() || null,
        totalPrice: selectedPrice,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Buyurtma yaratilmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-label="Yopish" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Reklama buyurtmasi</h2>
        <p className="mt-1 text-sm text-slate-600">{blogger.fullName}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Kontent formati</label>
            <div className="mt-2 space-y-2">
              {formats.length === 0 ? (
                <p className="text-sm text-slate-500">Blogger narxlarini kiritmagan</p>
              ) : (
                formats.map((f) => (
                  <label
                    key={f.format}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      contentFormat === f.format ? "border-[#1A56DB] bg-blue-50" : "border-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="format"
                        value={f.format}
                        checked={contentFormat === f.format}
                        onChange={() => setContentFormat(f.format)}
                      />
                      {FORMAT_LABELS[f.format] ?? f.format}
                    </span>
                    <span className="font-semibold text-[#1A56DB]">{formatPrice(f.price)}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Nashr sanasi</label>
            <input
              type="date"
              required
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Reklama haqida qisqacha</label>
            <textarea
              required
              value={briefDescription}
              onChange={(e) => setBriefDescription(e.target.value)}
              rows={4}
              placeholder="Nima reklama qilinishi kerak..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Havola (ixtiyoriy)</label>
            <input
              type="url"
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {selectedPrice != null && (
            <p className="text-sm font-semibold text-[#1A56DB]">Jami: {formatPrice(selectedPrice)}</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Bekor
            </button>
            <button
              type="submit"
              disabled={submitting || selectedPrice == null || formats.length === 0}
              className="flex-1 rounded-lg bg-[#1A56DB] py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
            >
              {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
