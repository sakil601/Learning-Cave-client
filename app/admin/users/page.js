"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice, Status } from "@/components/admin/AdminUI";

export default function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(page = 1) {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (filters.search.trim()) q.set("search", filters.search.trim());
      if (filters.role) q.set("role", filters.role);
      if (filters.status) q.set("status", filters.status);
      const result = await admin.users(q.toString());
      setRows(result.data || []);
      setPagination(result.pagination || { page, totalPages: 1, total: 0 });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, [filters.role, filters.status]);

  return (
    <>
      <AdminHeader
        title="Users"
        description="Search and review real student, instructor and admin accounts from the backend."
      />
      <Notice tone="error">{error}</Notice>

      <div className="admin-panel" style={{ marginTop: 0 }}>
        <div className="admin-toolbar">
          <input
            placeholder="Search name, email or phone"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && load(1)}
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="admin-mini-btn primary" onClick={() => load(1)}>
            Search
          </button>
        </div>
        <p className="admin-help">{pagination.total || 0} users found.</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    <div className="admin-code">{u.email}</div>
                  </td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <Status value={u.role} />
                  </td>
                  <td>
                    <Status value={u.accountStatus} />
                  </td>
                  <td>
                    {u.emailVerified ? "Email ✓" : "Email —"}
                    <br />
                    {u.phoneVerified ? "Phone ✓" : "Phone —"}
                  </td>
                  <td>
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleString()
                      : "Never"}
                  </td>
                </tr>
              ))}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan="6">No users found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="6">Loading users…</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-actions" style={{ marginTop: 14 }}>
          <button
            className="admin-mini-btn"
            disabled={pagination.page <= 1}
            onClick={() => load(pagination.page - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </span>
          <button
            className="admin-mini-btn"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => load(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
