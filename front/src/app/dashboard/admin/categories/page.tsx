"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { Category } from "@/types/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    apiGet<Category[]>("/api/categories?admin=true")
      .then(setCategories)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Yuklash amalga oshmadi");
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiPost("/api/categories", { name, type: type.trim() });
      setName("");
      setType("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qo'shish amalga oshmadi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Kategoriyani o'chirasizmi?")) return;
    try {
      await apiDelete(`/api/categories/${id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirish amalga oshmadi");
    }
  }

  return (
    <>
      <PageHeader title="Kategoriyalar" description="Istalgan turdagi kategoriyalar (ARTIST, VENUE, PHOTOGRAPHER...)" />
      <form onSubmit={handleCreate} className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nomi</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Turi</label>
          <input
            type="text"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="ARTIST, VENUE, PHOTOGRAPHER..."
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#1A56DB] px-5 py-2 text-sm font-medium text-white hover:bg-[#1444b0] disabled:opacity-60"
        >
          {submitting ? "Qo'shilmoqda..." : "Qo'shish"}
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : categories.length === 0 ? (
        <EmptyState title="Kategoriyalar yo'q" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Turi</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.type}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      O&apos;chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
