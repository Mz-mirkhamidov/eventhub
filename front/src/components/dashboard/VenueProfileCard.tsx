import { formatPrice, formatRating } from "@/lib/format";
import type { VenueProfile } from "@/types/api";

export default function VenueProfileCard({ profile }: { profile: VenueProfile }) {
  const verified = profile.verified ?? profile.isVerified;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
          {profile.categoryName && (
            <p className="mt-1 text-sm font-medium text-[#1A56DB]">{profile.categoryName}</p>
          )}
          <p className="mt-1 text-sm text-slate-600">{profile.address}</p>
        </div>
        {verified && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Tasdiqlangan
          </span>
        )}
      </div>
      {profile.description && <p className="mt-4 text-sm text-slate-600">{profile.description}</p>}
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Sig&apos;im</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{profile.capacity} kishi</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Soatlik narx</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(profile.pricePerHour)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">Reyting</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatRating(profile.rating)}</dd>
        </div>
      </dl>
    </article>
  );
}
