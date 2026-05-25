import type { BarterStatus, BookingStatus } from "@/types/api";

const BOOKING_LABELS: Record<BookingStatus, string> = {
  PENDING: "Kutilmoqda",
  CONFIRMED: "Tasdiqlangan",
  CANCELLED: "Bekor qilindi",
  COMPLETED: "Yakunlangan",
};

const BOOKING_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

const BARTER_LABELS: Record<BarterStatus, string> = {
  OPEN: "Ochiq",
  REQUESTED: "So'rov yuborilgan",
  CONFIRMED: "Tasdiqlangan",
  CLOSED: "Yopilgan",
};

const BARTER_STYLES: Record<BarterStatus, string> = {
  OPEN: "bg-emerald-100 text-emerald-800",
  REQUESTED: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-slate-100 text-slate-600",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${BOOKING_STYLES[status]}`}>
      {BOOKING_LABELS[status]}
    </span>
  );
}

export function BarterStatusBadge({ status }: { status: BarterStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${BARTER_STYLES[status]}`}>
      {BARTER_LABELS[status]}
    </span>
  );
}

export default function StatusBadge({
  status,
  variant = "booking",
}: {
  status: BookingStatus | BarterStatus;
  variant?: "booking" | "barter";
}) {
  if (variant === "barter") {
    return <BarterStatusBadge status={status as BarterStatus} />;
  }
  return <BookingStatusBadge status={status as BookingStatus} />;
}
