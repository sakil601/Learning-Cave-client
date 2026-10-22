"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

const groups = [
  {
    label: "Overview",
    links: [["/admin", "Dashboard"]],
  },
  {
    label: "Catalog",
    links: [
      ["/admin/categories", "Categories"],
      ["/admin/products", "Products"],
      ["/admin/courses", "Recorded Courses"],
      ["/admin/live-courses", "Live Courses"],
      ["/admin/ebooks", "E-Books"],
      ["/admin/digital-products", "Digital Products"],
      ["/admin/bundles", "Bundles"],
      ["/admin/coupons", "Coupons"],
    ],
  },
  {
    label: "Operations",
    links: [
      ["/admin/users", "Users"],
      ["/admin/instructors", "Instructors"],
      ["/admin/payments", "Payments"],
    ],
  },
];

export default function AdminShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (user.role !== "admin") router.replace("/dashboard");
  }, [loading, user, router, pathname]);

  if (loading || !user || user.role !== "admin") {
    return (
      <section className="section">
        <div className="container">
          <div className="admin-loading-card">Loading admin workspace…</div>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>LC</span>
          <div>
            <strong>Learning Cave</strong>
            <small>Admin Studio</small>
          </div>
        </div>

        <nav className="admin-nav-groups">
          {groups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <div className="admin-nav-label">{group.label}</div>
              {group.links.map(([href, label]) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                return (
                  <Link key={href} href={href} className={active ? "active" : ""}>
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-side-note">
          Signed in as
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  );
}
