"use client";

import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";

export default function BloggerHomePage() {
  return (
    <>
      <PageHeader title="Blogger paneli" description="Profilingiz va buyurtmalaringiz" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/blogger/profile" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Profilim</h3>
          <p className="mt-1 text-sm text-slate-600">Ijtimoiy tarmoqlar va narxlar</p>
        </Link>
        <Link href="/dashboard/blogger/bookings" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Buyurtmalar</h3>
          <p className="mt-1 text-sm text-slate-600">Kiruvchi so&apos;rovlar</p>
        </Link>
        <Link href="/dashboard/blogger/barter" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Barter</h3>
          <p className="mt-1 text-sm text-slate-600">Ochiq takliflar</p>
        </Link>
      </div>
    </>
  );
}
