"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

function formatDate(value) {
  if (!value) return "Schedule TBA";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function recordingLabel(recording) {
  if (!recording?.videoId) return null;
  return recording.provider === "youtube" ? "YouTube recording available" : "Class recording available";
}

export default function Page() {
  const { productId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.replace(`/login?next=/dashboard/live-courses/${productId}`);
    apiFetch(`/live-courses/me/${productId}`).then((x) => setData(x.data)).catch((e) => setError(e.message));
  }, [authLoading, user, productId, router]);

  if (authLoading || (!data && !error)) return <section className="dashboard-section"><div className="product-list-empty">Loading live course...</div></section>;
  if (error) return <section className="dashboard-section"><div className="product-list-empty">{error}</div></section>;

  const sessions = data.sessions || [];
  const upcoming = sessions.filter((s) => s.status === "scheduled" || s.status === "live").length;
  const completed = sessions.filter((s) => s.status === "completed").length;

  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">LIVE COURSE</span>
        <h1>{data.product?.title}</h1>
        <p>{data.product?.shortDescription || "Your live classes, joining links and recordings are managed here."}</p>
      </section>
      <section className="dashboard-section">
        <div className="live-batch-card">
          <div>
            <span className="ey small-ey">YOUR BATCH</span>
            <h2>{data.batch?.name || "Assigned batch"}</h2>
            <p>{data.batch?.startDate ? new Date(data.batch.startDate).toLocaleDateString() : "Start date TBA"} {data.batch?.endDate ? `— ${new Date(data.batch.endDate).toLocaleDateString()}` : ""}</p>
          </div>
          <div className="live-batch-stats"><span><strong>{upcoming}</strong> Upcoming</span><span><strong>{completed}</strong> Completed</span></div>
        </div>

        <div className="session-list">
          {sessions.map((session, index) => (
            <article className={`session-card status-${session.status}`} key={session._id}>
              <div className="session-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="session-main">
                <div className="session-title-row"><h3>{session.title}</h3><span className="session-status">{session.status}</span></div>
                <p>{formatDate(session.startsAt)}{session.endsAt ? ` — ${new Date(session.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</p>
                {recordingLabel(session.recording) && <small>{recordingLabel(session.recording)}</small>}
              </div>
              <div className="session-actions">
                {session.canJoin && session.meetingUrl ? <a className="btn primary" href={session.meetingUrl} target="_blank" rel="noreferrer">Join Class</a> : <span className="muted-chip">{session.status === "completed" ? "Class ended" : "Join link opens near class time"}</span>}
              </div>
            </article>
          ))}
          {!sessions.length && <div className="product-list-empty">No sessions scheduled yet.</div>}
        </div>
      </section>
    </>
  );
}
