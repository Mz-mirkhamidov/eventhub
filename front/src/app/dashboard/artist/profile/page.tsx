"use client";

import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import ArtistProfileCard from "@/components/dashboard/ArtistProfileCard";
import ImageUpload from "@/components/ui/ImageUpload";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type { ArtistProfile, Category } from "@/types/api";

export default function ArtistProfilePage() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bio, setBio] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerEvent, setPricePerEvent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Category[]>("/api/categories")
        .then((cats) => cats.filter((c) => c.type?.toUpperCase() !== "VENUE"))
        .catch(() => []),
      apiGet<ArtistProfile>("/api/artists/profile").catch((err) => {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }),
    ])
      .then(([cats, prof]) => {
        setCategories(cats);
        if (prof) {
          setProfile(prof);
          setBio(prof.bio ?? "");
          setPricePerHour(prof.pricePerHour != null ? String(prof.pricePerHour) : "");
          setPricePerEvent(prof.pricePerEvent != null ? String(prof.pricePerEvent) : "");
          setCategoryId(String(prof.categoryId));
          setProfilePhoto(prof.profilePhoto ?? "");
          setPortfolioPhotos(prof.portfolioPhotos ?? []);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Yuklash amalga oshmadi"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const updated = await apiPost<ArtistProfile>("/api/artists/profile", {
        bio: bio || null,
        profilePhoto: profilePhoto || null,
        portfolioPhotos,
        pricePerHour: pricePerHour ? Number(pricePerHour) : null,
        pricePerEvent: pricePerEvent ? Number(pricePerEvent) : null,
        categoryId: Number(categoryId),
      });
      setProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlash amalga oshmadi");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-slate-600">Yuklanmoqda...</p>;

  return (
    <>
      <PageHeader title="Profilim" description="San'atkor profilingizni to'ldiring" />
      {profile && (
        <div className="mb-6">
          <ArtistProfileCard profile={profile} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Kategoriya</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tanlang</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>
        <ImageUpload label="Profil rasmi" value={profilePhoto} onChange={(v) => setProfilePhoto(typeof v === "string" ? v : v[0] ?? "")} />
        <ImageUpload label="Portfolio (10 tagacha)" value={portfolioPhotos} onChange={(v) => setPortfolioPhotos(Array.isArray(v) ? v : v ? [v] : [])} multiple maxFiles={10} />
        <div>
          <label className="block text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Soatlik narx</label>
            <input
              type="number"
              min={0}
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tadbir narxi</label>
            <input
              type="number"
              min={0}
              value={pricePerEvent}
              onChange={(e) => setPricePerEvent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
        >
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </>
  );
}
