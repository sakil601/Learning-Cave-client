"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function label(value) {
  return String(value || "—").replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/profile");
  }, [loading, user, router]);

  if (loading || !user) return <section className="section"><div className="container"><p>Loading profile...</p></div></section>;

  const initials = (user.name || "U").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <>
      <section className="page-hero"><div className="container"><span className="ey">ACCOUNT</span><h1>My Profile</h1><p>Your Learning Cave account information.</p></div></section>
      <section className="section"><div className="container profile-layout-v2">
        <aside className="profile-summary-card">
          <div className="profile-avatar-large">{initials}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="profile-role-badge">{label(user.role)}</span>
          <div className="profile-quick-links">
            <Link href="/dashboard">My Purchase</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/dashboard/notifications">Notifications</Link>
          </div>
        </aside>

        <div className="profile-details-card">
          <div className="profile-details-head"><div><span className="ey">PROFILE DETAILS</span><h2>Account information</h2></div><span className={`account-status ${user.accountStatus || "active"}`}>{label(user.accountStatus || "active")}</span></div>
          <dl className="profile-definition-list">
            <div><dt>Full name</dt><dd>{user.name || "—"}</dd></div>
            <div><dt>Email</dt><dd>{user.email || "—"}</dd></div>
            <div><dt>Phone</dt><dd>{user.phone || "—"}</dd></div>
            <div><dt>Account type</dt><dd>{label(user.role)}</dd></div>
            <div><dt>Account status</dt><dd>{label(user.accountStatus || "active")}</dd></div>
          </dl>
          <div className="profile-readonly-note"><strong>View only</strong><p>Profile editing will be enabled after the backend profile-update endpoint is added.</p></div>
        </div>
      </div></section>
    </>
  );
}
