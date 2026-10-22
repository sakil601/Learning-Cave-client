"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <section className="section">
        <div className="container"><p>Loading your account...</p></div>
      </section>
    );
  }

  return (
    <div className="dashboard-shell container">
      <DashboardNav />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
