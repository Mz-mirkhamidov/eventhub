"use client";

import { formatFollowers, formatPlatformLabel, formatPrice, formatRating } from "@/lib/format";
import type { BloggerProfile, ContentFormat } from "@/types/api";

const FORMAT_LABELS: Record<ContentFormat, string> = {
  STORY: "Story",
  POST: "Post",
  REEL: "Reel",
  VIDEO: "Video",
  REVIEW: "Review",
};

export default function BloggerProfileModal({
  open,
  onClose,
  blogger,
  onOrder,
}: {
  open: boolean;
  onClose: () => void;
  blogger: BloggerProfile | null;
  onOrder: () => void;
}) {
  if (!open || !blogger) return null;

  const portfolio = (blogger as BloggerProfile & { portfolioPhotos?: string[] }).portfolioPhotos;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-label="Yopish" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        {blogger.profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blogger.profilePhoto} alt="" className="h-56 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center bg-slate-100 text-4xl text-slate-400">👤</div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{blogger.fullName}</h2>
              {blogger.categories?.length > 0 && (
                <p className="mt-1 text-sm font-medium text-[#1A56DB]">{blogger.categories.join(" · ")}</p>
              )}
            </div>
            <p className="text-sm text-slate-600">⭐ {formatRating(blogger.rating)}</p>
          </div>
          {blogger.bio && <p className="mt-4 text-sm text-slate-600">{blogger.bio}</p>}

          <section className="mt-6">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Platformalar</h3>
            <ul className="mt-2 space-y-2">
              {blogger.platforms?.map((p, i) => (
                <li key={i} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium">{formatPlatformLabel(p.platform)}</span>
                  {p.username && <span className="text-slate-600"> · @{p.username}</span>}
                  <span className="text-slate-600"> · {formatFollowers(p.followerCount)} obunachi</span>
                  {p.profileUrl && (
                    <a href={p.profileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#1A56DB] hover:underline">
                      Profil
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Narxlar</h3>
            <ul className="mt-2 space-y-1">
              {blogger.contentFormats?.map((f) => (
                <li key={f.format} className="flex justify-between text-sm">
                  <span>{FORMAT_LABELS[f.format] ?? f.format}</span>
                  <span className="font-semibold text-slate-900">{formatPrice(f.price)}</span>
                </li>
              ))}
            </ul>
          </section>

          {portfolio && portfolio.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-semibold uppercase text-slate-500">Ish namunalari</h3>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {portfolio.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="" className="h-20 w-full rounded-lg object-cover" />
                ))}
              </div>
            </section>
          )}

          <div className="mt-6 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Yopish
            </button>
            <button type="button" onClick={onOrder} className="flex-1 rounded-lg bg-[#1A56DB] py-2.5 text-sm font-medium text-white hover:bg-[#1444b0]">
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
