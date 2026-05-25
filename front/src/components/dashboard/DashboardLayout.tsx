"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStoredAuth, getStoredAuth } from "@/lib/auth";
import { getDashboardPathForRole, ROLE_LABELS, type NavItem } from "@/lib/dashboard";
import type { StoredAuth, UserRole } from "@/types/auth";

export default function DashboardLayout({
  role,
  navItems,
  children,
}: {
  role: UserRole;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = getStoredAuth();
    if (!s?.token) {
      router.replace("/login");
      return;
    }
    if (s.role !== role) {
      router.replace(getDashboardPathForRole(s.role));
      return;
    }
    setAuth(s);
  }, [role, router]);

  function isActive(href: string) {
    const home = getDashboardPathForRole(role);
    if (href === home) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Yopish"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/" className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A56DB] text-sm font-bold text-white">
              E
            </span>
            <span className="font-bold text-slate-900">
              Event<span className="text-[#1A56DB]">hub</span>
            </span>
          </Link>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {ROLE_LABELS[role]}
          </p>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-[#1A56DB] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 pt-4">
            <p className="truncate text-sm font-medium text-slate-900">{auth.fullName}</p>
            <button
              type="button"
              onClick={() => {
                clearStoredAuth();
                router.push("/login");
              }}
              className="mt-2 w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Chiqish
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="text-sm font-medium text-slate-700">
            Menyu
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
