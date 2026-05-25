"use client";

import { formatPrice } from "@/lib/format";
import {
  advanceAmount,
  advancePercentForItem,
  displayNameForItem,
  type AdvanceLine,
  type SelectedPlanItem,
} from "@/lib/planner";

export default function AdvancePaymentModal({
  items,
  open,
  busy,
  onClose,
  onConfirm,
}: {
  items: SelectedPlanItem[];
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: (lines: AdvanceLine[]) => void;
}) {
  if (!open) return null;

  const lines: AdvanceLine[] = items.map((item) => {
    const percent = advancePercentForItem(item);
    const amount = advanceAmount(item.price, percent);
    return { item, percent, amount };
  });
  const totalAdvance = lines.reduce((s, l) => s + l.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Oldindan to&apos;lov</h2>
        <p className="mt-1 text-sm text-slate-600">Har bir xizmat uchun oldindan to&apos;lov miqdori</p>
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={line.item.key} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="font-medium text-slate-900">{displayNameForItem(line.item)}</span>
              <span className="text-slate-600">
                {" "}
                — {line.percent}% oldindan to&apos;lov: {formatPrice(line.amount)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-slate-200 pt-4 text-base font-semibold text-[#1A56DB]">
          Jami oldindan to&apos;lov: {formatPrice(totalAdvance)}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Bekor
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onConfirm(lines)}
            className="flex-1 rounded-xl bg-[#1A56DB] py-3 text-sm font-semibold text-white hover:bg-[#1444b0] disabled:opacity-60"
          >
            {busy ? "Bron qilinmoqda..." : "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
