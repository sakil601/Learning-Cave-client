"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({ unreadCount: 0, notifications: [] });
  const [loading, setLoading] = useState(true);

  async function load() {
    const result = await apiFetch("/notifications");
    setData(result.data || { unreadCount: 0, notifications: [] });
    setLoading(false);
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.replace("/login?next=/dashboard/notifications");
    load();
  }, [authLoading, user, router]);

  async function readAll() {
    await apiFetch("/notifications/read-all", { method: "PATCH" });
    await load();
  }

  async function markRead(id) {
    await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
    await load();
  }

  if (authLoading || loading || !user) return <section className="section"><div className="container"><p>Loading notifications...</p></div></section>;

  return <><section className="page-hero"><div className="container"><span className="ey">ACCOUNT</span><h1>Notifications</h1><p>{data.unreadCount} unread</p></div></section><section className="section"><div className="container" style={{ maxWidth: 900 }}><div className="page-actions"><button className="btn" onClick={readAll}>Mark all read</button></div>{(data.notifications || []).map((n) => <div className="purchase-card" key={n._id} style={{ opacity: n.isRead ? .7 : 1 }}><div className="purchase-info"><h3>{n.title}</h3><span className="purchase-date">{n.message}</span></div><div className="purchase-progress">{!n.isRead && <button className="btn ghost" onClick={() => markRead(n._id)}>Mark read</button>}</div></div>)}{!data.notifications?.length && <div className="product-list-empty">No notifications yet.</div>}</div></section></>;
}
