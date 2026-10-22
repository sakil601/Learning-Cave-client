"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

function accessLabel(item) {
  if (item.expiresAt) {
    return `Access until ${new Date(item.expiresAt).toLocaleDateString()}`;
  }
  if (item.accessType === "lifetime") return "Lifetime access";
  return item.accessType || item.orderNumber || "Active access";
}

function itemHref(item, product, kind) {
  if (kind === "course") return `/learn/${item.course?._id || item.course}`;
  if (kind === "live") return `/dashboard/live-courses/${product?._id}`;
  if (kind === "ebook") return `/dashboard/ebooks/${product?._id}`;
  if (kind === "digital") return `/dashboard/digital-products/${product?._id}`;
  if (kind === "bundle") return `/dashboard/bundles/${product?._id}`;
  return "#";
}

export default function AccountListPage({ title, eyebrow, endpoint, kind }) {
  const [items, setItems] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiFetch(endpoint)
      .then(async (result) => {
        const rows = result.data || [];
        if (cancelled) return;
        setItems(rows);

        if (kind === "course" && rows.length) {
          const results = await Promise.allSettled(
            rows.map((item) => {
              const courseId = item.course?._id || item.course;
              return apiFetch(`/progress/courses/${courseId}`).then((x) => [courseId, x.data]);
            }),
          );

          if (!cancelled) {
            const next = {};
            for (const result of results) {
              if (result.status === "fulfilled") {
                const [courseId, progress] = result.value;
                next[String(courseId)] = progress;
              }
            }
            setProgressMap(next);
          }
        }
      })
      .catch((error) => setMessage(error.message || "Could not load your items."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [endpoint, kind]);

  const emptyText = useMemo(() => {
    if (kind === "course") return "You have no recorded course enrollments yet.";
    if (kind === "live") return "You have no live course access yet.";
    if (kind === "ebook") return "You have no purchased e-books yet.";
    if (kind === "digital") return "You have no digital products yet.";
    if (kind === "bundle") return "You have no purchased bundles yet.";
    return "Nothing here yet.";
  }, [kind]);

  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">{eyebrow}</span>
        <h1>{title}</h1>
        <p>Everything you own stays here so you can continue from any device.</p>
      </section>

      <section className="dashboard-section">
        {loading && <p>Loading...</p>}
        {message && <div className="product-list-empty">{message}</div>}

        <div className="account-library-grid">
          {items.map((item, index) => {
            const product = item.product || item;
            const courseId = item.course?._id || item.course;
            const progress = progressMap[String(courseId)] || null;
            const percent = Math.max(0, Math.min(100, Math.round(progress?.progressPercent || 0)));
            const href = itemHref(item, product, kind);

            return (
              <article className="account-library-card" key={item._id || item.accessId || item.orderId || index}>
                <div className="account-library-thumb">
                  <img src={product?.thumbnail || "/assets/thumbs/excel.jpg"} alt={product?.title || item.title || "Learning Cave"} />
                </div>
                <div className="account-library-body">
                  <div>
                    <span className="ey small-ey">{kind === "course" ? "RECORDED COURSE" : kind.toUpperCase()}</span>
                    <h3>{product?.title || item.title}</h3>
                    <p>{product?.shortDescription || accessLabel(item)}</p>
                  </div>

                  {kind === "course" && (
                    <div className="library-progress-block">
                      <div className="library-progress-head"><span>Progress</span><strong>{percent}%</strong></div>
                      <div className="progress-bar wide"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
                      {progress?.lastLesson?.title && <small>Last lesson: {progress.lastLesson.title}</small>}
                    </div>
                  )}

                  {kind !== "course" && <small>{accessLabel(item)}</small>}

                  <Link className="btn primary" href={href}>
                    {kind === "course" ? (percent > 0 ? "Continue Learning" : "Start Learning") : "Open"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && !items.length && !message && <div className="product-list-empty">{emptyText}</div>}
      </section>
    </>
  );
}
