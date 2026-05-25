"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiDelete, apiGet } from "@/lib/api";
import { EVENT_TYPES, PLANNER_STORAGE_KEY, type EventPlan, type SavedPlanPayload } from "@/lib/planner";
import { formatDate, formatPrice } from "@/lib/format";
import type { SavedEventPlan } from "@/types/api";

function serviceCount(plan: SavedEventPlan): number {
  try {
    const data = JSON.parse(plan.selectedServices) as SavedPlanPayload;
    return data.services?.length ?? data.selected?.length ?? 0;
  } catch {
    return 0;
  }
}

export default function ClientPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SavedEventPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiGet<SavedEventPlan[]>("/api/plans/my")
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Rejani o'chirasizmi?")) return;
    setBusyId(id);
    try {
      await apiDelete(`/api/plans/${id}`);
      setMessage("Reja o'chirildi");
      load();
    } catch {
      setMessage("O'chirishda xatolik");
    } finally {
      setBusyId(null);
    }
  }

  function handleContinue(plan: SavedEventPlan) {
    let payload: SavedPlanPayload | null = null;
    try {
      payload = JSON.parse(plan.selectedServices) as SavedPlanPayload;
    } catch {
      payload = null;
    }
    const restored: EventPlan = {
      eventType: plan.eventType as EventPlan["eventType"],
      city: plan.city,
      services: payload?.services ?? [],
      budget: Number(plan.budget),
      eventDate: plan.eventDate,
      guestCount: plan.guestsCount,
      selected: [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(restored));
    localStorage.setItem("eventhub_planner_restore_note", "1");
    router.push("/plan");
  }

  const eventLabel = (type: string) => EVENT_TYPES.find((e) => e.id === type)?.label ?? type;

  return (
    <>
      <PageHeader
        title="Mening rejalarim"
        description="Saqlangan tadbir rejalari"
        action={
          <Link
            href="/plan"
            className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
          >
            Yangi reja
          </Link>
        }
      />
      {message && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{message}</p>
      )}
      {loading ? (
        <p className="text-slate-500">Yuklanmoqda...</p>
      ) : plans.length === 0 ? (
        <EmptyState
          title="Rejalar yo'q"
          description="Tadbir rejalashtiruvchida reja tuzing va saqlang"
          action={
            <Link href="/plan" className="text-sm font-medium text-[#1A56DB] hover:underline">
              Reja tuzish
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((p) => (
            <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{eventLabel(p.eventType)}</h3>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>Joy: {p.city}</li>
                <li>Sana: {formatDate(p.eventDate)}</li>
                <li>Xizmatlar: {serviceCount(p)} ta</li>
                <li>Byudjet: {formatPrice(p.budget)}</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleContinue(p)}
                  className="rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1444b0]"
                >
                  Davom ettirish
                </button>
                <button
                  type="button"
                  disabled={busyId === p.id}
                  onClick={() => handleDelete(p.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  O&apos;chirish
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
