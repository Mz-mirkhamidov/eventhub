"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { apiGet } from "@/lib/api";
import type { Category, UserListItem } from "@/types/api";

export default function AdminStatsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<UserListItem[]>("/api/users").catch(() => [] as UserListItem[]),
      apiGet<Category[]>("/api/categories?admin=true").catch(() => [] as Category[]),
    ])
      .then(([u, c]) => {
        setUsers(u);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const byRole = (role: string) => users.filter((u) => u.role === role).length;
  const artistCats = categories.filter((c) => c.type === "ARTIST").length;
  const venueCats = categories.filter((c) => c.type === "VENUE").length;

  return (
    <>
      <PageHeader title="Statistika" description="Platforma ko'rsatkichlari" />
      {loading ? (
        <p className="text-slate-600">Yuklanmoqda...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Jami foydalanuvchilar" value={users.length} />
          <StatCard label="Mijozlar" value={byRole("CLIENT")} />
          <StatCard label="San'atkorlar" value={byRole("ARTIST")} />
          <StatCard label="Toyxonalar" value={byRole("VENUE")} />
          <StatCard label="Bizneslar" value={byRole("BUSINESS")} />
          <StatCard label="Kategoriyalar" value={categories.length} hint={`${artistCats} san'atkor · ${venueCats} toyxona`} />
        </div>
      )}
    </>
  );
}
