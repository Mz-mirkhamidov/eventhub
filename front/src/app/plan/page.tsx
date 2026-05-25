"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdvancePaymentModal from "@/components/planner/AdvancePaymentModal";
import PlannerProgress from "@/components/planner/PlannerProgress";
import { apiGet, apiPost } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import {
  BUDGET_PRESETS,
  EVENT_TYPES,
  PLANNER_SERVICES,
  UZBEKISTAN_CITIES,
  emptyPlan,
  estimateArtistPrice,
  estimateBloggerPrice,
  estimateVenuePrice,
  loadPlan,
  planTotal,
  savePlan,
  serializePlanForApi,
  type AdvanceLine,
  type EventPlan,
  type PlannerStep,
  type SelectedPlanItem,
} from "@/lib/planner";
import type { ArtistProfile, BloggerProfile, Category, PageResponse, VenueProfile } from "@/types/api";

const STEP_TITLES: Record<PlannerStep, string> = {
  1: "Tadbir turi",
  2: "Joylashuv",
  3: "Kerakli xizmatlar",
  4: "Budjet va sana",
  5: "Mos xizmatlar",
  6: "Mening tadbirim",
};

function stepClass(visible: boolean) {
  return `transition-all duration-400 ease-out ${visible ? "animate-search-fade-in opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`;
}

export default function PlanPage() {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<PlannerStep>(1);
  const [plan, setPlan] = useState<EventPlan>(emptyPlan);
  const [results, setResults] = useState<Record<string, (VenueProfile | ArtistProfile | BloggerProfile)[]>>({});
  const [loadingResults, setLoadingResults] = useState(false);
  const [bookingAll, setBookingAll] = useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = loadPlan();
    if (saved?.eventType) setPlan(saved);
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const updatePlan = useCallback((patch: Partial<EventPlan>) => {
    setPlan((p) => ({ ...p, ...patch }));
  }, []);

  const maxPricePerService = useMemo(() => {
    if (!plan.budget || plan.services.length === 0) return undefined;
    return Math.ceil(plan.budget / plan.services.length);
  }, [plan.budget, plan.services]);

  const fetchResults = useCallback(async () => {
    setLoadingResults(true);
    setMessage("");
    const map: Record<string, (VenueProfile | ArtistProfile | BloggerProfile)[]> = {};
    try {
      const categories = await apiGet<Category[]>("/api/categories").catch(() => [] as Category[]);
      for (const sid of plan.services) {
        const def = PLANNER_SERVICES.find((s) => s.id === sid);
        if (!def) continue;
        const params = new URLSearchParams({ page: "0", size: "12" });
        if (maxPricePerService) params.set("maxPrice", String(maxPricePerService));

        if (def.fetchType === "venue") {
          if (plan.city) params.set("city", plan.city);
          if (plan.guestCount) params.set("minCapacity", String(plan.guestCount));
          const data = await apiGet<PageResponse<VenueProfile>>(`/api/venues/search?${params}`);
          map[sid] = data.content ?? [];
        } else if (def.fetchType === "artist") {
          const cat = categories.find((c) => {
            if (c.type?.toUpperCase() === "VENUE") return false;
            if (def.categoryTypes?.some((t) => c.type?.toUpperCase() === t)) return true;
            const name = c.name.toLowerCase();
            return def.categoryKeywords?.some((k) => name.includes(k.toLowerCase()));
          });
          if (cat) params.set("categoryId", String(cat.id));
          if (plan.city) params.set("search", plan.city);
          const data = await apiGet<PageResponse<ArtistProfile>>(`/api/artists/search?${params}`);
          map[sid] = data.content?.length ? data.content : await apiGet<PageResponse<ArtistProfile>>(`/api/artists/search?${new URLSearchParams({ page: "0", size: "12", ...(maxPricePerService ? { maxPrice: String(maxPricePerService) } : {}) })}`).then((d) => d.content ?? []);
        } else if (def.fetchType === "blogger") {
          if (plan.city) params.set("category", plan.city);
          const data = await apiGet<PageResponse<BloggerProfile>>(`/api/bloggers/search?${params}`);
          map[sid] = data.content ?? [];
        }
      }
      setResults(map);
    } catch {
      setMessage("Xizmatlarni yuklashda xatolik");
    } finally {
      setLoadingResults(false);
    }
  }, [plan.services, plan.city, plan.guestCount, maxPricePerService]);

  useEffect(() => {
    if (step === 5) fetchResults();
  }, [step, fetchResults]);

  function toggleVenue(serviceId: string, label: string, v: VenueProfile) {
    const key = `venue-${v.id}`;
    if (plan.selected.some((s) => s.key === key)) {
      updatePlan({ selected: plan.selected.filter((s) => s.key !== key) });
      return;
    }
    const item: SelectedPlanItem = {
      key,
      serviceId,
      serviceLabel: label,
      type: "venue",
      profile: v,
      price: estimateVenuePrice(v),
    };
    updatePlan({ selected: [...plan.selected, item] });
  }

  function toggleArtist(serviceId: string, label: string, a: ArtistProfile) {
    const key = `artist-${a.id}`;
    if (plan.selected.some((s) => s.key === key)) {
      updatePlan({ selected: plan.selected.filter((s) => s.key !== key) });
      return;
    }
    const item: SelectedPlanItem = {
      key,
      serviceId,
      serviceLabel: label,
      type: "artist",
      profile: a,
      price: estimateArtistPrice(a),
    };
    updatePlan({ selected: [...plan.selected, item] });
  }

  function toggleBlogger(serviceId: string, label: string, b: BloggerProfile) {
    const key = `blogger-${b.id}`;
    if (plan.selected.some((s) => s.key === key)) {
      updatePlan({ selected: plan.selected.filter((s) => s.key !== key) });
      return;
    }
    const item: SelectedPlanItem = {
      key,
      serviceId,
      serviceLabel: label,
      type: "blogger",
      profile: b,
      price: estimateBloggerPrice(b),
    };
    updatePlan({ selected: [...plan.selected, item] });
  }

  async function executeBookings(lines: AdvanceLine[]) {
    if (!plan.eventDate || lines.length === 0) return;
    setBookingAll(true);
    setMessage("");
    const eventLabel = EVENT_TYPES.find((e) => e.id === plan.eventType)?.label ?? "Tadbir";
    try {
      for (const line of lines) {
        const { item, amount } = line;
        const common = {
          totalPrice: item.price,
          advancePayment: amount,
          eventCity: plan.city,
          guestsCount: plan.guestCount,
        };
        if (item.type === "venue") {
          await apiPost("/api/bookings", {
            orderType: "VENUE_BOOKING",
            venueId: item.profile.id,
            eventDate: plan.eventDate,
            startTime: "18:00",
            endTime: "23:00",
            ...common,
            notes: `Eventhub reja: ${eventLabel}`,
          });
        } else if (item.type === "artist") {
          await apiPost("/api/bookings", {
            orderType: "ARTIST_BOOKING",
            artistId: item.profile.id,
            eventDate: plan.eventDate,
            startTime: null,
            endTime: null,
            ...common,
            notes: `Eventhub reja: ${item.serviceLabel}`,
          });
        } else {
          const format = item.contentFormat ?? item.profile.contentFormats?.[0]?.format ?? "POST";
          await apiPost("/api/bookings", {
            orderType: "BLOGGER_ORDER",
            bloggerId: item.profile.id,
            publicationDate: plan.eventDate,
            contentFormat: format,
            briefDescription: `${eventLabel} — ${plan.city}`,
            ...common,
          });
        }
      }
      setAdvanceModalOpen(false);
      router.push("/dashboard/client/bookings?success=1");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bron yaratishda xatolik");
    } finally {
      setBookingAll(false);
    }
  }

  function openBookAll() {
    if (!plan.eventDate || plan.selected.length === 0) return;
    if (!getStoredAuth()) {
      setMessage("Bron qilish uchun tizimga kiring");
      router.push("/login");
      return;
    }
    setAdvanceModalOpen(true);
  }

  async function handleSave() {
    const auth = getStoredAuth();
    if (!auth) {
      setMessage("Rejani saqlash uchun tizimga kiring");
      router.push("/login");
      return;
    }
    if (!plan.eventType || !plan.city || !plan.eventDate) {
      setMessage("Avval tadbir ma'lumotlarini to'ldiring");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await apiPost("/api/plans", {
        eventType: plan.eventType,
        city: plan.city,
        date: plan.eventDate,
        guestsCount: plan.guestCount,
        budget: plan.budget,
        selectedServices: serializePlanForApi(plan),
      });
      savePlan(plan);
      setMessage("Reja saqlandi!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  function canNext(): boolean {
    switch (step) {
      case 1:
        return !!plan.eventType;
      case 2:
        return !!plan.city;
      case 3:
        return plan.services.length > 0;
      case 4:
        return plan.budget > 0 && !!plan.eventDate && plan.guestCount > 0;
      case 5:
        return plan.selected.length > 0;
      default:
        return true;
    }
  }

  function next() {
    if (step < 6) setStep((step + 1) as PlannerStep);
    else if (step === 5 && plan.selected.length > 0) setStep(6);
  }

  function back() {
    if (step > 1) setStep((step - 1) as PlannerStep);
  }

  const eventLabel = EVENT_TYPES.find((e) => e.id === plan.eventType)?.label;

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard/client" className="text-lg font-bold text-[#1A56DB]">
            Eventhub.uz
          </Link>
          <span className="text-sm font-medium text-slate-600">Tadbir rejalashtirish</span>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <PlannerProgress step={step} />
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">{STEP_TITLES[step]}</h1>
        <p className="mb-8 text-slate-600">
          {step === 1 && "Tadbiringiz turini tanlang — shu asosida tavsiyalar moslashtiriladi."}
          {step === 2 && "Tadbir qayerda bo'lishini belgilang."}
          {step === 3 && "Bir nechta xizmatni tanlashingiz mumkin."}
          {step === 4 && "Byudjet, sana va mehmonlar sonini kiriting."}
          {step === 5 && "Mos xizmatlarni tanlang — keyin xulosani ko'rasiz."}
          {step === 6 && "Tanlangan xizmatlar va taxminiy jami narx."}
        </p>

        {message && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{message}</p>
        )}

        {/* Step 1 */}
        <section className={step === 1 ? stepClass(true) : stepClass(false)}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_TYPES.map((et, i) => (
              <button
                key={et.id}
                type="button"
                onClick={() => updatePlan({ eventType: et.id })}
                className={`rounded-2xl border-2 p-5 text-left transition-all hover:shadow-lg ${
                  plan.eventType === et.id
                    ? "border-[#1A56DB] bg-blue-50 shadow-md ring-2 ring-[#1A56DB]/20"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-4xl">{et.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{et.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{et.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 */}
        <section className={step === 2 ? stepClass(true) : stepClass(false)}>
          <label className="block text-sm font-medium text-slate-700">Viloyat / shahar</label>
          <select
            value={plan.city}
            onChange={(e) => updatePlan({ city: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-[#1A56DB] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20"
          >
            <option value="">Tanlang...</option>
            {UZBEKISTAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </section>

        {/* Step 3 */}
        <section className={step === 3 ? stepClass(true) : stepClass(false)}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLANNER_SERVICES.map((s) => {
              const on = plan.services.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    updatePlan({
                      services: on ? plan.services.filter((x) => x !== s.id) : [...plan.services, s.id],
                    })
                  }
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    on ? "border-[#1A56DB] bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-sm font-medium text-slate-800">{s.label}</span>
                  {on && <span className="ml-auto text-[#1A56DB]">✓</span>}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-slate-500">{plan.services.length} ta xizmat tanlandi</p>
        </section>

        {/* Step 4 */}
        <section className={step === 4 ? stepClass(true) : stepClass(false)}>
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Taxminiy budjet (so&apos;m)</label>
              <input
                type="number"
                min={0}
                value={plan.budget || ""}
                onChange={(e) => updatePlan({ budget: Number(e.target.value) })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg"
                placeholder="Masalan: 20000000"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {BUDGET_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => updatePlan({ budget: p.value })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      plan.budget === p.value ? "bg-[#1A56DB] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Tadbir sanasi</label>
              <input
                type="date"
                value={plan.eventDate}
                onChange={(e) => updatePlan({ eventDate: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mehmonlar soni</label>
              <input
                type="number"
                min={1}
                value={plan.guestCount}
                onChange={(e) => updatePlan({ guestCount: Number(e.target.value) })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className={step === 5 ? stepClass(true) : stepClass(false)}>
          {loadingResults ? (
            <p className="text-center text-slate-600">Mos xizmatlar qidirilmoqda...</p>
          ) : (
            <div className="space-y-10">
              {plan.services.map((sid) => {
                const def = PLANNER_SERVICES.find((s) => s.id === sid);
                const list = results[sid] ?? [];
                if (!def) return null;
                return (
                  <div key={sid}>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <span>{def.icon}</span> {def.label}
                    </h2>
                    {list.length === 0 ? (
                      <p className="text-sm text-slate-500">Hozircha mos natija topilmadi</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {list.map((item) => {
                          if (def.fetchType === "venue") {
                            const v = item as VenueProfile;
                            const key = `venue-${v.id}`;
                            const sel = plan.selected.some((s) => s.key === key);
                            return (
                              <ResultCard
                                key={key}
                                selected={sel}
                                title={v.name}
                                subtitle={v.address}
                                price={estimateVenuePrice(v)}
                                image={v.coverPhoto}
                                onSelect={() => toggleVenue(sid, def.label, v)}
                              />
                            );
                          }
                          if (def.fetchType === "artist") {
                            const a = item as ArtistProfile;
                            const key = `artist-${a.id}`;
                            const sel = plan.selected.some((s) => s.key === key);
                            return (
                              <ResultCard
                                key={key}
                                selected={sel}
                                title={a.fullName}
                                subtitle={a.categoryName}
                                price={estimateArtistPrice(a)}
                                image={a.profilePhoto}
                                onSelect={() => toggleArtist(sid, def.label, a)}
                              />
                            );
                          }
                          const b = item as BloggerProfile;
                          const key = `blogger-${b.id}`;
                          const sel = plan.selected.some((s) => s.key === key);
                          return (
                            <ResultCard
                              key={key}
                              selected={sel}
                              title={b.fullName}
                              subtitle={b.categories?.join(", ")}
                              price={estimateBloggerPrice(b)}
                              image={b.profilePhoto}
                              onSelect={() => toggleBlogger(sid, def.label, b)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {plan.selected.length > 0 && (
            <p className="mt-6 text-center text-sm font-medium text-[#1A56DB]">
              {plan.selected.length} ta xizmat tanlandi
            </p>
          )}
        </section>

        {/* Step 6 */}
        <section className={step === 6 ? stepClass(true) : stepClass(false)}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Tadbir</dt>
                <dd className="font-medium text-slate-900">{eventLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Joy</dt>
                <dd className="font-medium text-slate-900">{plan.city}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Sana</dt>
                <dd className="font-medium text-slate-900">{plan.eventDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Mehmonlar</dt>
                <dd className="font-medium text-slate-900">{plan.guestCount}</dd>
              </div>
            </dl>
          </div>
          <ul className="mt-6 space-y-3">
            {plan.selected.map((item) => (
              <li key={item.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-medium text-slate-900">
                    {item.type === "venue"
                      ? item.profile.name
                      : item.type === "artist"
                        ? item.profile.fullName
                        : item.profile.fullName}
                  </p>
                  <p className="text-sm text-slate-500">{item.serviceLabel}</p>
                </div>
                <p className="font-semibold text-[#1A56DB]">{formatPrice(item.price)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-right text-xl font-bold text-slate-900">
            Jami: <span className="text-[#1A56DB]">{formatPrice(planTotal(plan))}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {saving ? "Saqlanmoqda..." : "Saqlab qo'yish"}
            </button>
            <button
              type="button"
              disabled={bookingAll || plan.selected.length === 0}
              onClick={openBookAll}
              className="flex-1 rounded-xl bg-[#1A56DB] py-3 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
            >
              Hammasini bron qilish
            </button>
          </div>
        </section>

        <AdvancePaymentModal
          items={plan.selected}
          open={advanceModalOpen}
          busy={bookingAll}
          onClose={() => setAdvanceModalOpen(false)}
          onConfirm={executeBookings}
        />

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-200 pt-8">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Orqaga
          </button>
          {step < 6 && (
            <button
              type="button"
              onClick={() => {
                if (step === 5 && plan.selected.length > 0) setStep(6);
                else if (canNext()) next();
              }}
              disabled={!canNext() && step !== 5}
              className="rounded-xl bg-[#1A56DB] px-8 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-[#1444b0] disabled:opacity-50"
            >
              {step === 5 ? "Xulosaga o'tish" : "Keyingi"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultCard({
  title,
  subtitle,
  price,
  image,
  selected,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  price: number;
  image?: string | null;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-xl border-2 bg-white transition-all ${
        selected ? "border-[#1A56DB] ring-2 ring-[#1A56DB]/20" : "border-slate-200"
      }`}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-28 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{subtitle}</p>}
        <p className="mt-2 text-sm font-medium text-[#1A56DB]">{formatPrice(price)}</p>
        <button
          type="button"
          onClick={onSelect}
          className={`mt-3 w-full rounded-lg py-2 text-sm font-medium ${
            selected ? "bg-emerald-600 text-white" : "bg-[#1A56DB] text-white hover:bg-[#1444b0]"
          }`}
        >
          {selected ? "✓ Tanlangan" : "Tanlash"}
        </button>
      </div>
    </article>
  );
}
