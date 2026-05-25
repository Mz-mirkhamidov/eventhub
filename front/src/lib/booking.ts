export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function hoursBetween(startTime: string, endTime: string): number {
  const diff = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
  return Math.max(0, diff / 60);
}

export function calculateBookingTotal(
  startTime: string,
  endTime: string,
  pricePerHour?: number | null,
  pricePerEvent?: number | null,
): number | null {
  if (!startTime || !endTime || parseTimeToMinutes(endTime) <= parseTimeToMinutes(startTime)) return null;
  if (pricePerHour != null && pricePerHour > 0) return Math.round(pricePerHour * hoursBetween(startTime, endTime));
  if (pricePerEvent != null && pricePerEvent > 0) return Math.round(pricePerEvent);
  return null;
}
