"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin/users");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-slate-600">Yo&apos;naltirilmoqda...</p>
    </div>
  );
}
