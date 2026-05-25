"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import { calculateBookingTotal } from "@/lib/booking";
import { formatPrice } from "@/lib/format";
import type { ArtistProfile, VenueProfile } from "@/types/api";

type BookingTarget =
  | { type: "artist"; profile: ArtistProfile }
  | { type: "venue"; profile: VenueProfile };

type ArtistPricing = "hourly" | "event";

export default function BookingModal({
  open,
  onClose,
  target,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  target: BookingTarget | null;
  onSuccess?: () => void;
}) {
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [artistPricing, setArtistPricing] = useState<ArtistPricing>("event");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
      setAdvancePayment("");
      setArtistPricing("event");
      setPhotoIndex(0);
      setError("");
    }
  }, [open]);

  const venuePhotos = useMemo(() => {
    if (!target || target.type !== "venue") return [];
    const p = target.profile;
    const list: string[] = [];
    if (p.coverPhoto) list.push(p.coverPhoto);
    if (p.photos) list.push(...p.photos.filter((u) => u !== p.coverPhoto));
    return list;
  }, [target]);

  if (!open || !target) return null;

  const isVenue = target.type === "venue";
  const isArtist = target.type === "artist";
  const title = isVenue ? target.profile.name : target.profile.fullName;
  const headerPhoto = isArtist ? target.profile.profilePhoto : venuePhotos[photoIndex];

  const pricePerHour = isVenue ? target.profile.pricePerHour : isArtist && artistPricing === "hourly" ? target.profile.pricePerHour : null;
  const pricePerEvent = isArtist && artistPricing === "event" ? target.profile.pricePerEvent : null;

  const total = isArtist && artistPricing === "event"
    ? pricePerEvent && pricePerEvent > 0 ? Math.round(pricePerEvent) : null
    : calculateBookingTotal(startTime, endTime, pricePerHour, null);

  const canSubmit = isArtist
    ? artistPricing === "event"
      ? !!eventDate && total != null
      : !!eventDate && !!startTime && !!endTime && total != null
    : !!eventDate && !!startTime && !!endTime && total != null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!target || !canSubmit || total == null) {
      setError("Ma'lumotlarni to'ldiring");
      return;
    }
    const current = target;
    setSubmitting(true);
    setError("");
    try {
      if (current.type === "artist") {
        await apiPost("/api/bookings", {
          orderType: "ARTIST_BOOKING",
          artistId: current.profile.id,
          eventDate,
          startTime: artistPricing === "hourly" ? startTime : null,
          endTime: artistPricing === "hourly" ? endTime : null,
          totalPrice: total,
          advancePayment: advancePayment ? Number(advancePayment) : null,
          notes: notes || null,
        });
      } else {
        await apiPost("/api/bookings", {
          orderType: "VENUE_BOOKING",
          venueId: current.profile.id,
          eventDate,
          startTime,
          endTime,
          totalPrice: total,
          advancePayment: advancePayment ? Number(advancePayment) : null,
          notes: notes || null,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bron yaratilmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-label="Yopish" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        {headerPhoto && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={headerPhoto} alt="" className="h-40 w-full object-cover" />
            {isVenue && venuePhotos.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {venuePhotos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    className={`h-2 w-2 rounded-full ${i === photoIndex ? "bg-white" : "bg-white/50"}`}
                    aria-label={`Rasm ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900">Bron qilish</h2>
          <p className="mt-1 text-sm text-slate-600">{title}</p>
          {isVenue && (
            <p className="mt-1 text-sm text-slate-500">Sig&apos;im: {target.profile.capacity} kishi · {formatPrice(target.profile.pricePerHour)}/soat</p>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {isArtist && (target.profile.pricePerHour || target.profile.pricePerEvent) && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Narx turi</label>
                <div className="mt-2 flex gap-2">
                  {target.profile.pricePerEvent != null && target.profile.pricePerEvent > 0 && (
                    <button
                      type="button"
                      onClick={() => setArtistPricing("event")}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${artistPricing === "event" ? "border-[#1A56DB] bg-blue-50 font-medium" : "border-slate-200"}`}
                    >
                      Tadbir · {formatPrice(target.profile.pricePerEvent)}
                    </button>
                  )}
                  {target.profile.pricePerHour != null && target.profile.pricePerHour > 0 && (
                    <button
                      type="button"
                      onClick={() => setArtistPricing("hourly")}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${artistPricing === "hourly" ? "border-[#1A56DB] bg-blue-50 font-medium" : "border-slate-200"}`}
                    >
                      Soatlik · {formatPrice(target.profile.pricePerHour)}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Sana</label>
              <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>

            {(isVenue || (isArtist && artistPricing === "hourly")) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Boshlanish</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Tugash</label>
                  <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
              </div>
            )}

            {isVenue && (
              <p className="text-xs text-slate-500">Jami narx: soatlar × soatlik narx. Oldindan to&apos;lov ixtiyoriy.</p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Oldindan to&apos;lov (ixtiyoriy)</label>
              <input type="number" min={0} value={advancePayment} onChange={(e) => setAdvancePayment(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Izoh</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            {total != null && <p className="text-sm font-semibold text-[#1A56DB]">Jami: {formatPrice(total)}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Bekor</button>
              <button type="submit" disabled={submitting || !canSubmit} className="flex-1 rounded-lg bg-[#1A56DB] py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
                {submitting ? "Yuborilmoqda..." : "Bron qilish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
