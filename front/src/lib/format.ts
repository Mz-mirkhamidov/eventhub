export function formatFollowers(count: number | null | undefined): string {
  if (count == null) return "—";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return count.toLocaleString("uz-UZ");
}

const PLATFORM_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  TELEGRAM: "Telegram",
};

export function formatPlatformLabel(platform: string): string {
  return PLATFORM_LABELS[platform] ?? platform;
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}

export function formatRating(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toFixed(1);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export function formatTime(time: string | null | undefined): string {
  return time?.slice(0, 5) ?? "";
}

export function sumEarnings(bookings: { status: string; totalPrice: number }[]): number {
  return bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((s, b) => s + Number(b.totalPrice), 0);
}
