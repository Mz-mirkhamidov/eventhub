"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardPathForRole, getStoredAuth } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth?.token) {
      router.replace("/login");
      return;
    }
    router.replace(getDashboardPathForRole(auth.role));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-600">Yo&apos;naltirilmoqda...</p>
    </div>
  );
}
