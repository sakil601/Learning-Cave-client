"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice } from "@/components/admin/AdminUI";

export default function AdminPage() {
  const [stats, setStats] = useState({
    categories: "—",
    products: "—",
    courses: "—",
    coupons: "—",
    published: "—",
    drafts: "—",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      admin.categories(),
      admin.products("limit=1"),
      admin.courses("limit=1"),
      admin.coupons(),
      admin.products("limit=1&status=published"),
      admin.products("limit=1&status=draft"),
    ]).then((r) => {
      setStats({
        categories: r[0].status === "fulfilled" ? r[0].value?.data?.length ?? 0 : "—",
        products: r[1].status === "fulfilled" ? r[1].value?.pagination?.total ?? r[1].value?.data?.length ?? 0 : "—",
        courses: r[2].status === "fulfilled" ? r[2].value?.pagination?.total ?? r[2].value?.data?.length ?? 0 : "—",
        coupons: r[3].status === "fulfilled" ? r[3].value?.data?.length ?? 0 : "—",
        published: r[4].status === "fulfilled" ? r[4].value?.pagination?.total ?? r[4].value?.data?.length ?? 0 : "—",
        drafts: r[5].status === "fulfilled" ? r[5].value?.pagination?.total ?? r[5].value?.data?.length ?? 0 : "—",
      });
      if (r.some((x) => x.status === "rejected")) {
        setError("Some dashboard counters could not be loaded. Individual admin pages can still be used.");
      }
    });
  }, []);

  const quickLinks = [
    ["New recorded course", "/admin/courses", "Create a draft course, then add modules, lessons, resources and quiz."],
    ["New product", "/admin/products", "Create live course, ebook, digital product or bundle product metadata."],
    ["Manage categories", "/admin/categories", "Keep the public dynamic course hierarchy organized."],
    ["Review payments", "/admin/payments", "Review the live payment queue and verify or reject manual payments."],
    ["Instructor approval", "/admin/instructors", "Review instructor accounts and approve, reject or suspend them."],
    ["Coupons", "/admin/coupons", "Create or update percentage and fixed discount rules."],
  ];

  return (
    <>
      <AdminHeader
        title="Learning Cave Studio"
        description="Backend-driven administration for the current Learning Cave Express API."
        actions={<Link href="/" className="btn">View Website</Link>}
      />
      <Notice>{error}</Notice>

      <div className="admin-grid admin-grid-six">
        <div className="admin-stat"><span>Categories</span><strong>{stats.categories}</strong><small>active + inactive</small></div>
        <div className="admin-stat"><span>All Products</span><strong>{stats.products}</strong><small>non-deleted</small></div>
        <div className="admin-stat"><span>Recorded Courses</span><strong>{stats.courses}</strong><small>managed courses</small></div>
        <div className="admin-stat"><span>Published</span><strong>{stats.published}</strong><small>public products</small></div>
        <div className="admin-stat"><span>Draft Products</span><strong>{stats.drafts}</strong><small>need configuration</small></div>
        <div className="admin-stat"><span>Coupons</span><strong>{stats.coupons}</strong><small>all coupon rules</small></div>
      </div>

      <div className="admin-panel">
        <div className="admin-section-head">
          <div><span className="admin-gap-kicker">Quick actions</span><h2>Continue managing Learning Cave</h2></div>
        </div>
        <div className="admin-quick-grid">
          {quickLinks.map(([title, href, description]) => (
            <Link href={href} className="admin-quick-link" key={href + title}>
              <strong>{title}</strong>
              <p>{description}</p>
              <span>Open →</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-readiness-grid">
        <div className="admin-panel" style={{ marginTop: 0 }}>
          <span className="admin-gap-kicker">Connected now</span>
          <h2>Core admin API coverage</h2>
          <div className="admin-check-list">
            <span>✓ Category CRUD</span>
            <span>✓ Product CRUD</span>
            <span>✓ Recorded course curriculum</span>
            <span>✓ Module resources + full quiz CRUD</span>
            <span>✓ Live batches + sessions</span>
            <span>✓ E-book / digital / bundle config</span>
            <span>✓ Coupons</span>
            <span>✓ User + instructor directories</span>
            <span>✓ Payment queue + verify/reject</span>
          </div>
        </div>

        <div className="admin-panel" style={{ marginTop: 0 }}>
          <span className="admin-gap-kicker">Newly connected</span>
          <h2>Gap APIs now in the frontend</h2>
          <div className="admin-check-list">
            <span>✓ Admin user directory</span>
            <span>✓ Instructor directory</span>
            <span>✓ Admin payment queue</span>
            <span>✓ Live-course list / product lookup</span>
            <span>✓ Module → quiz lookup + edit/delete</span>
            <span>✓ Student order history</span>
            <span>✓ Public live-course batch selection</span>
          </div>
        </div>
      </div>
    </>
  );
}
