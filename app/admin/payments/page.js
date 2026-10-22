"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice, Status } from "@/components/admin/AdminUI";

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState([]),
    [filters, setFilters] = useState({ status: "", method: "", search: "" }),
    [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0,
    }),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load(page = 1) {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      Object.entries(filters).forEach(([k, v]) => v && q.set(k, v));
      const r = await admin.payments(q.toString());
      setRows(r.data || []);
      setPagination(r.pagination || {});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(1);
  }, [filters.status, filters.method]);
  async function action(row, type) {
    if (!confirm(`${type === "verify" ? "Verify" : "Reject"} this payment?`))
      return;
    setBusy(row._id + type);
    setError("");
    try {
      const r =
        type === "verify"
          ? await admin.verifyManualPayment(row._id)
          : await admin.rejectManualPayment(row._id);
      setMessage(r.message || "Payment updated.");
      await load(pagination.page || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <AdminHeader
        title="Payments"
        description="Real payment queue with order, user, method and verification actions."
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{message}</Notice>
      <div className="admin-panel" style={{ marginTop: 0 }}>
        <div className="admin-toolbar">
          <input
            placeholder="Transaction, user, email or phone"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && load(1)}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          >
            <option value="">All methods</option>
            <option value="manual">Manual</option>
            <option value="sslcommerz">SSLCommerz</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="bank_transfer">Bank</option>
          </select>
          <button className="admin-mini-btn primary" onClick={() => load(1)}>
            Search
          </button>
        </div>
        <p className="admin-help">{pagination.total || 0} payments found.</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id}>
                  <td>
                    <strong>{p.order?.orderNumber || "—"}</strong>
                    <div className="admin-code">
                      {" "}
                      {p.order?.paymentStatus || ""}
                    </div>
                  </td>
                  <td>
                    <strong>{p.user?.name || "—"}</strong>
                    <div className="admin-code">{p.user?.email || ""}</div>
                  </td>
                  <td>{p.method}</td>
                  <td>৳{Number(p.amount || 0).toLocaleString()}</td>
                  <td>
                    <Status value={p.status} />
                  </td>
                  <td>{p.transactionId || p.gatewayReference || "—"}</td>
                  <td>
                    {p.method === "manual" && p.status === "pending" ? (
                      <div className="admin-actions">
                        <button
                          className="admin-mini-btn primary"
                          disabled={!!busy}
                          onClick={() => action(p, "verify")}
                        >
                          Verify
                        </button>
                        <button
                          className="admin-mini-btn danger"
                          disabled={!!busy}
                          onClick={() => action(p, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="admin-help">
                        {p.verifiedBy?.name ? `By ${p.verifiedBy.name}` : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="7">Loading payments…</td>
                </tr>
              )}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan="7">No payments found.</td>
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
