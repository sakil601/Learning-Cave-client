"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [live, setLive] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [digital, setDigital] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [orders, setOrders] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiFetch("/enrollments/me"),
      apiFetch("/live-courses/me"),
      apiFetch("/ebooks/me"),
      apiFetch("/digital-products/me"),
      apiFetch("/bundles/me"),
      apiFetch("/notifications"),
      apiFetch("/orders/me?limit=5"),
    ]).then(async (results) => {
      const val = (i) => results[i].status === "fulfilled" ? results[i].value : null;
      const recorded = val(0)?.data || [];
      setCourses(recorded);
      setLive(val(1)?.data || []);
      setEbooks(val(2)?.data || []);
      setDigital(val(3)?.data || []);
      setBundles(val(4)?.data || []);
      setNotifications(val(5)?.data?.unreadCount || 0);
      setOrders(val(6)?.data || []);

      const progressResults = await Promise.allSettled(
        recorded.slice(0, 6).map((item) => {
          const courseId = item.course?._id || item.course;
          return apiFetch(`/progress/courses/${courseId}`).then((x) => [courseId, x.data]);
        }),
      );
      const next = {};
      for (const result of progressResults) {
        if (result.status === "fulfilled") next[String(result.value[0])] = result.value[1];
      }
      setProgressMap(next);
      setLoading(false);
    });
  }, []);

  const cards = useMemo(() => [
    ["Recorded Courses", courses.length, "/dashboard/courses", "Continue self-paced learning"],
    ["Live Courses", live.length, "/dashboard/live-courses", "Your batches and sessions"],
    ["E-Books", ebooks.length, "/dashboard/ebooks", "Read or download purchases"],
    ["Digital Products", digital.length, "/dashboard/digital-products", "Files and templates"],
    ["Bundles", bundles.length, "/dashboard/bundles", "Purchased collections"],
    ["Orders", orders.length, "/dashboard/orders", "Recent orders and payment status"],
    ["Notifications", notifications, "/dashboard/notifications", "Unread updates"],
  ], [courses.length, live.length, ebooks.length, digital.length, bundles.length, orders.length, notifications]);

  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">ACCOUNT</span>
        <h1>My Purchase</h1>
        <p>Welcome back, {user?.name}. Continue your Learning Cave journey.</p>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-stat-grid">
          {cards.map(([title, count, href, desc]) => (
            <Link href={href} className="dashboard-stat-card" key={title}>
              <strong>{loading ? "—" : count}</strong>
              <div><h3>{title}</h3><p>{desc}</p></div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <div className="dashboard-block-head">
          <div><span className="ey">RECENT COURSES</span><h2>Continue learning</h2></div>
          <Link href="/dashboard/courses">View all</Link>
        </div>

        <div className="continue-list">
          {courses.slice(0, 5).map((enrollment) => {
            const courseId = enrollment.course?._id || enrollment.course;
            const progress = progressMap[String(courseId)] || {};
            const percent = Math.round(progress.progressPercent || 0);
            return (
              <article className="continue-card" key={enrollment._id}>
                <img src={enrollment.product?.thumbnail || "/assets/thumbs/excel.jpg"} alt={enrollment.product?.title || "Course"} />
                <div className="continue-card-body">
                  <div><h3>{enrollment.product?.title}</h3><p>{enrollment.product?.shortDescription || "Continue where you left off."}</p></div>
                  <div className="continue-progress">
                    <div className="library-progress-head"><span>{progress.lastLesson?.title || "Course progress"}</span><strong>{percent}%</strong></div>
                    <div className="progress-bar wide"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
                  </div>
                  <Link className="btn primary" href={`/learn/${courseId}`}>{percent > 0 ? "Continue" : "Start course"}</Link>
                </div>
              </article>
            );
          })}
          {!loading && !courses.length && <div className="product-list-empty">You have no recorded course enrollments yet.</div>}
        </div>
      </section>
    </>
  );
}
