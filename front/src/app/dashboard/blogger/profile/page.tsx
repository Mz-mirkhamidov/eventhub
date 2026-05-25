"use client";

import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import ImageUpload from "@/components/ui/ImageUpload";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type { BloggerContentFormat, BloggerPlatform, BloggerProfile, ContentFormat, SocialPlatform } from "@/types/api";

const PLATFORMS: SocialPlatform[] = ["INSTAGRAM", "TIKTOK", "YOUTUBE"];
const FORMATS: ContentFormat[] = ["STORY", "POST", "REEL", "VIDEO", "REVIEW"];

export default function BloggerProfilePage() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [platforms, setPlatforms] = useState<BloggerPlatform[]>([]);
  const [contentFormats, setContentFormats] = useState<BloggerContentFormat[]>([]);
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<BloggerProfile>("/api/bloggers/profile")
      .then((p) => {
        setProfile(p);
        setBio(p.bio ?? "");
        setProfilePhoto(p.profilePhoto ?? "");
        setPlatforms(p.platforms ?? []);
        setContentFormats(p.contentFormats ?? []);
        setCategories((p.categories ?? []).join(", "));
      })
      .catch((err) => {
        if (!(err instanceof ApiError && err.status === 404)) {
          setError(err instanceof Error ? err.message : "Yuklash amalga oshmadi");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function addPlatform() {
    setPlatforms([...platforms, { platform: "INSTAGRAM", username: "", followerCount: 0, profileUrl: "" }]);
  }

  function addFormat() {
    setContentFormats([...contentFormats, { format: "POST", price: 0 }]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const updated = await apiPost<BloggerProfile>("/api/bloggers/profile", {
        bio: bio || null,
        profilePhoto: profilePhoto || null,
        platforms,
        contentFormats,
        categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
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
      <PageHeader title="Profilim" description="Blogger profilingizni to'ldiring" />
      {profile && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">{profile.fullName}</h2>
          {profile.profilePhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profilePhoto} alt="" className="mt-3 h-24 w-24 rounded-full object-cover" />
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <ImageUpload label="Profil rasmi" value={profilePhoto} onChange={(v) => setProfilePhoto(typeof v === "string" ? v : v[0] ?? "")} />
        <div>
          <label className="block text-sm font-medium text-slate-700">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Kategoriyalar (vergul bilan)</label>
          <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="moda, sayohat, oziq-ovqat" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Ijtimoiy tarmoqlar</h3>
            <button type="button" onClick={addPlatform} className="text-sm text-[#1A56DB]">+ Qo'shish</button>
          </div>
          {platforms.map((p, i) => (
            <div key={i} className="mb-3 grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
              <select value={p.platform} onChange={(e) => { const n = [...platforms]; n[i] = { ...p, platform: e.target.value as SocialPlatform }; setPlatforms(n); }} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
                {PLATFORMS.map((pl) => <option key={pl} value={pl}>{pl}</option>)}
              </select>
              <input placeholder="Username" value={p.username} onChange={(e) => { const n = [...platforms]; n[i] = { ...p, username: e.target.value }; setPlatforms(n); }} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
              <input type="number" placeholder="Obunachilar" value={p.followerCount || ""} onChange={(e) => { const n = [...platforms]; n[i] = { ...p, followerCount: Number(e.target.value) }; setPlatforms(n); }} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
              <input placeholder="Profil URL" value={p.profileUrl} onChange={(e) => { const n = [...platforms]; n[i] = { ...p, profileUrl: e.target.value }; setPlatforms(n); }} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Kontent formatlari va narxlar</h3>
            <button type="button" onClick={addFormat} className="text-sm text-[#1A56DB]">+ Qo'shish</button>
          </div>
          {contentFormats.map((f, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <select value={f.format} onChange={(e) => { const n = [...contentFormats]; n[i] = { ...f, format: e.target.value as ContentFormat }; setContentFormats(n); }} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
                {FORMATS.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
              </select>
              <input type="number" min={0} placeholder="Narx" value={f.price || ""} onChange={(e) => { const n = [...contentFormats]; n[i] = { ...f, price: Number(e.target.value) }; setContentFormats(n); }} className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60">
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </>
  );
}
