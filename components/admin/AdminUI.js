"use client";

export function AdminHeader({ eyebrow = "ADMIN", title, description, actions }) {
  return (
    <div className="admin-page-head">
      <div>
        <span className="ey">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="admin-head-actions">{actions}</div>}
    </div>
  );
}

export function Notice({ children, tone = "info" }) {
  if (!children) return null;
  return <div className={`admin-notice ${tone}`}>{children}</div>;
}

export function Empty({ children = "No data found." }) {
  return <div className="admin-empty">{children}</div>;
}

export function Status({ value }) {
  return (
    <span className={`admin-status status-${value || "unknown"}`}>
      {String(value || "unknown").replaceAll("_", " ")}
    </span>
  );
}

export function AdminLoading({ children = "Loading data…" }) {
  return <div className="admin-loading-card">{children}</div>;
}

export function ApiGap({ title, children, endpoint }) {
  return (
    <div className="admin-gap-card">
      <div>
        <span className="admin-gap-kicker">Backend API pending</span>
        <h3>{title}</h3>
        <p>{children}</p>
        {endpoint && <code>{endpoint}</code>}
      </div>
      <span className="admin-gap-badge">Pending</span>
    </div>
  );
}
