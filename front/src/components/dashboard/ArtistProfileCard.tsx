import { formatPrice, formatRating } from "@/lib/format";
import type { ArtistProfile } from "@/types/api";

export default function ArtistProfileCard({ profile }: { profile: ArtistProfile }) {
  const verified = profile.verified ?? profile.isVerified;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
          <p className="mt-1 text-sm text-[#1A56DB]">{profile.categoryName}</p>
        </div>
        {verified && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Tasdiqlangan
          </span>
        )}
      </div>
      {profile.bio && <p className="mt-4 text-sm text-slate-600">{profile.bio}</p>}
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Soatlik narx</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(profile.pricePerHour)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Tadbir narxi</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(profile.pricePerEvent)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Reyting</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatRating(profile.rating)}</dd>
        </div>
      </dl>
    </article>
  );
}
