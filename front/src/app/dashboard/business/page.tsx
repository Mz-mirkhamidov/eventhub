"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ImageUpload from "@/components/ui/ImageUpload";
import { apiGet, apiPost } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import type { BarterOffer, BarterRequestItem, BusinessProfile } from "@/types/api";

export default function BusinessDashboardPage() {
  const auth = getStoredAuth();
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [requests, setRequests] = useState<BarterRequestItem[]>([]);
  const [logo, setLogo] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<BarterOffer[]>("/api/barter/offers/mine").catch(() => []),
      apiGet<BarterRequestItem[]>("/api/barter/requests/incoming").catch(() => []),
      apiGet<BusinessProfile>("/api/business/profile").catch(() => null),
    ]).then(([o, r, prof]) => {
      setOffers(o);
      setRequests(r);
      if (prof) {
        setLogo(prof.logo ?? "");
        setAddress(prof.address ?? "");
        setLatitude(prof.latitude != null ? String(prof.latitude) : "");
        setLongitude(prof.longitude != null ? String(prof.longitude) : "");
      }
    });
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileMsg("");
    try {
      await apiPost("/api/business/profile", {
        logo: logo || null,
        address: address || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      });
      setProfileMsg("Profil saqlandi");
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setSaving(false);
    }
  }

  const openOffers = offers.filter((o) => o.status === "OPEN").length;
  const pendingRequests = requests.filter((r) => r.status === "REQUESTED").length;

  return (
    <>
      <PageHeader title="Biznes paneli" description={auth ? `Xush kelibsiz, ${auth.fullName}!` : undefined} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Takliflar" value={offers.length} />
        <StatCard label="Ochiq takliflar" value={openOffers} />
        <StatCard label="Kutilayotgan so'rovlar" value={pendingRequests} />
      </div>
      <form onSubmit={saveProfile} className="mt-8 max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Kompaniya profili</h3>
        <ImageUpload label="Logo" value={logo} onChange={(v) => setLogo(typeof v === "string" ? v : v[0] ?? "")} />
        <div>
          <label className="block text-sm font-medium text-slate-700">Manzil</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Kenglik</label>
            <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Uzunlik</label>
            <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
        {profileMsg && <p className="text-sm text-slate-600">{profileMsg}</p>}
        <button type="submit" disabled={saving} className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
          {saving ? "Saqlanmoqda..." : "Profilni saqlash"}
        </button>
      </form>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/business/offers" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">Takliflarim</h3>
          <p className="mt-1 text-sm text-slate-600">Barter takliflarini boshqarish</p>
        </Link>
        <Link href="/dashboard/business/requests" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1A56DB]">
          <h3 className="font-semibold text-slate-900">So&apos;rovlar</h3>
          <p className="mt-1 text-sm text-slate-600">Kelgan arizalarni ko&apos;rish</p>
        </Link>
      </div>
    </>
  );
}
