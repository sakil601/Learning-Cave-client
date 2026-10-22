"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice, Status } from "@/components/admin/AdminUI";

export default function AdminInstructorsPage() {
  const [rows, setRows] = useState([]),
    [status, setStatus] = useState(""),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ limit: "100" });
      if (status) q.set("status", status);
      if (search.trim()) q.set("search", search.trim());
      const r = await admin.instructors(q.toString());
      setRows(r.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [status]);
  async function change(id, next) {
    if (!confirm(`Change instructor status to ${next}?`)) return;
    try {
      setError("");
      const r = await admin.updateInstructorStatus(id, next);
      setMessage(r.message || "Instructor updated.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <>
      <AdminHeader
        title="Instructors"
        description="Review real instructor accounts and approve, reject or suspend them."
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{message}</Notice>
      <div className="admin-panel" style={{ marginTop: 0 }}>
        <div className="admin-toolbar">
          <input
            placeholder="Search instructor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="admin-mini-btn primary" onClick={load}>
            Search
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    <div>{u.email}</div>
                  </td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <Status value={u.accountStatus} />
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-mini-btn primary"
                        onClick={() => change(u._id, "active")}
                      >
                        Approve
                      </button>
                      <button
                        className="admin-mini-btn"
                        onClick={() => change(u._id, "rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className="admin-mini-btn danger"
                        onClick={() => change(u._id, "suspended")}
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="5">Loading instructors…</td>
                </tr>
              )}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan="5">No instructors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
