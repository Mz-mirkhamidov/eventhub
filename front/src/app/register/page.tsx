"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { getDashboardPathForRole, register } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "CLIENT", label: "Mijoz" },
  { value: "ARTIST", label: "San'atkor" },
  { value: "VENUE", label: "Toyxona" },
  { value: "BUSINESS", label: "Biznes" },
  { value: "BLOGGER", label: "Blogger / Influencer" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await register({ fullName, phone, email, password, role });
      router.push(getDashboardPathForRole(auth.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tish amalga oshmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Ro'yxatdan o'tish"
      subtitle="Eventhub.uz da yangi hisob yarating"
      footerText="Allaqachon hisobingiz bormi?"
      footerHref="/login"
      footerLinkLabel="Kirish"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
            To&apos;liq ism
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
            placeholder="Ism Familiya"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
            placeholder="+998 90 123 45 67"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
            placeholder="siz@email.uz"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Parol
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
            placeholder="Kamida 6 ta belgi"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">
            Rol
          </label>
          <select
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1A56DB] py-3 text-sm font-semibold text-white transition hover:bg-[#1444b0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Kutilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>
    </AuthCard>
  );
}
