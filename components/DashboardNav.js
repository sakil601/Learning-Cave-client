"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Overview", "/dashboard"],
  ["My Courses", "/dashboard/courses"],
  ["Live Courses", "/dashboard/live-courses"],
  ["E-Books", "/dashboard/ebooks"],
  ["Digital Products", "/dashboard/digital-products"],
  ["Bundles", "/dashboard/bundles"],
  ["Orders", "/dashboard/orders"],
  ["Notifications", "/dashboard/notifications"],
  ["Wishlist", "/wishlist"],
  ["Profile", "/profile"],
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-nav" aria-label="Account navigation">
      <div className="dashboard-nav-title">My Account</div>
      <nav>
        {items.map(([label, href]) => {
          const active = href === "/dashboard"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`dashboard-nav-link${active ? " active" : ""}`}
            >
              <span>{label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
