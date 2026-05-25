"use client";

import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import VenueProfileCard from "@/components/dashboard/VenueProfileCard";
import ImageUpload from "@/components/ui/ImageUpload";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type { Category, VenueProfile } from "@/types/api";

export default function VenueProfilePage() {
  const [profile, setProfile] = useState<VenueProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Category[]>("/api/categories?type=VENUE").catch(() => []),
      apiGet<VenueProfile>("/api/venues/profile").catch((err) => {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }),
    ])
      .then(([cats, prof]) => {
        setCategories(cats);
        if (prof) {
          setProfile(prof);
          setName(prof.name);
          setDescription(prof.description ?? "");
          setAddress(prof.address);
          setLatitude(prof.latitude != null ? String(prof.latitude) : "");
          setLongitude(prof.longitude != null ? String(prof.longitude) : "");
          setCapacity(String(prof.capacity));
          setPricePerHour(String(prof.pricePerHour));
          if (prof.categoryId != null) setCategoryId(String(prof.categoryId));
          setCoverPhoto(prof.coverPhoto ?? "");
          setPhotos(prof.photos ?? []);
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
      const updated = await apiPost<VenueProfile>("/api/venues/profile", {
        categoryId: categoryId ? Number(categoryId) : null,
        name,
        coverPhoto: coverPhoto || null,
        photos,
        description: description || null,
        address,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        capacity: Number(capacity),
        pricePerHour: Number(pricePerHour),
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
      <PageHeader title="Profilim" description="Toyxona profilingizni to'ldiring" />
      {profile && (
        <div className="mb-6">
          <VenueProfileCard profile={profile} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Kategoriya</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tanlang</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <ImageUpload label="Muqova rasmi" value={coverPhoto} onChange={(v) => setCoverPhoto(typeof v === "string" ? v : v[0] ?? "")} />
        <ImageUpload label="Galereya (10 tagacha)" value={photos} onChange={(v) => setPhotos(Array.isArray(v) ? v : v ? [v] : [])} multiple maxFiles={10} />
        <div>
          <label className="block text-sm font-medium text-slate-700">Nomi</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tavsif</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Manzil</label>
          <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Sig&apos;im</label>
            <input type="number" required min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Soatlik narx</label>
            <input type="number" required min={0} value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </>
  );
}
