"use client"; // যেহেতু হুক ব্যবহার করছো, তাই এটি উপরে থাকা জরুরি

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/components/AuthProvider";
// তোমার তৈরি করা Loading কম্পোনেন্টটি ইমপোর্ট করো (পাথটি তোমার ফাইল স্ট্রাকচার অনুযায়ী মিলিয়ে নিও)
import Loading from "@/app/loading";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/login?next=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  }, [loading, user, router]);

  // "Loading your account..." এর পরিবর্তে আমাদের স্পিনারটি রিটার্ন করা হলো
  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="dashboard-shell container">
      <DashboardNav />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
