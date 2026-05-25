import { ROLE_LABELS } from "@/lib/dashboard";
import type { UserRole } from "@/types/auth";

const ROLE_STYLES: Record<UserRole, string> = {
  CLIENT: "bg-slate-100 text-slate-700",
  ARTIST: "bg-purple-100 text-purple-800",
  VENUE: "bg-orange-100 text-orange-800",
  BUSINESS: "bg-teal-100 text-teal-800",
  BLOGGER: "bg-pink-100 text-pink-800",
  ADMIN: "bg-[#1A56DB]/10 text-[#1A56DB]",
};

export default function RoleBadge({ role }: { role: string }) {
  const key = role as UserRole;
  const label = ROLE_LABELS[key] ?? role;
  const style = ROLE_STYLES[key] ?? "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
