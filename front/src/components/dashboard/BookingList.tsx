"use client";

import { useState } from "react";
import CancelBookingModal from "@/components/dashboard/CancelBookingModal";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiPut } from "@/lib/api";
import { formatDate, formatPrice, formatTime } from "@/lib/format";
import type { Booking } from "@/types/api";

type ShowActions = "both" | "cancel-only" | "none";

export default function BookingList({
  bookings,
  onRefresh,
  showActions = "none",
  cancelPendingOnly = false,
}: {
  bookings: Booking[];
  onRefresh?: () => void;
  showActions?: ShowActions;
  cancelPendingOnly?: boolean;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);

  async function handleConfirm(id: string) {
    setBusyId(id);
    setError("");
    try {
      await apiPut(`/api/bookings/${id}/confirm`);
      onRefresh?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tasdiqlash amalga oshmadi");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancelConfirm(reason: string) {
    if (!cancelId) return;
    setBusyId(cancelId);
    setError("");
    try {
      await apiPut(`/api/bookings/${cancelId}/cancel`, { reason });
      setCancelId(null);
      onRefresh?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bekor qilish amalga oshmadi");
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return <EmptyState title="Bronlar yo'q" description="Hozircha hech qanday bron topilmadi" />;
  }

  const canAct = showActions !== "none";

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <CancelBookingModal
        open={cancelId !== null}
        busy={busyId !== null}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancelConfirm}
      />
      {bookings.map((b) => {
        const isPending = b.status === "PENDING";
        const showConfirm = showActions === "both" && isPending;
        const showCancel =
          showActions === "cancel-only"
            ? !cancelPendingOnly || isPending
            : showActions === "both" && isPending;
        const cancelDisabled = cancelPendingOnly && !isPending;
        const isBloggerOrder = b.orderType === "BLOGGER_ORDER";
        const dateLabel = isBloggerOrder && b.publicationDate
          ? formatDate(b.publicationDate)
          : formatDate(b.eventDate);
        const advance = b.advancePayment ?? 0;
        const remaining =
          b.remainingPayment != null ? b.remainingPayment : Math.max(0, b.totalPrice - advance);

        return (
          <article
            key={b.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {isBloggerOrder ? (
                  <>
                    <p className="text-xs font-medium uppercase text-pink-600">Reklama buyurtmasi</p>
                    <p className="mt-1 font-semibold text-slate-900">Nashr: {dateLabel}</p>
                    {b.contentFormat && <p className="mt-1 text-sm text-slate-600">Format: {b.contentFormat}</p>}
                    {b.briefDescription && <p className="mt-2 text-sm text-slate-500">{b.briefDescription}</p>}
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-900">{dateLabel}</p>
                    {b.startTime && b.endTime && (
                      <p className="mt-1 text-sm text-slate-600">
                        {formatTime(b.startTime)} – {formatTime(b.endTime)}
                      </p>
                    )}
                  </>
                )}
                <p className="mt-2 text-sm font-medium text-[#1A56DB]">Jami: {formatPrice(b.totalPrice)}</p>
                {advance > 0 && (
                  <p className="mt-1 text-sm text-slate-600">Oldindan to&apos;langan: {formatPrice(advance)}</p>
                )}
                {b.status !== "CANCELLED" && remaining > 0 && (
                  <p className="mt-1 text-sm text-slate-600">Qolgan to&apos;lov: {formatPrice(remaining)}</p>
                )}
                {b.status === "CANCELLED" && b.cancellationReason && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                    Bekor qilish sababi: {b.cancellationReason}
                  </p>
                )}
                {b.notes && !isBloggerOrder && <p className="mt-2 text-sm text-slate-500">{b.notes}</p>}
              </div>
              <BookingStatusBadge status={b.status} />
            </div>
            {canAct && (showConfirm || showCancel) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {showConfirm && (
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => handleConfirm(b.id)}
                    className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
                  >
                    Tasdiqlash
                  </button>
                )}
                {showCancel && (
                  <button
                    type="button"
                    disabled={busyId === b.id || cancelDisabled}
                    onClick={() => setCancelId(b.id)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
