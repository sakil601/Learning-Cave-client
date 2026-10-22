"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice, Status } from "@/components/admin/AdminUI";

export default function LiveAdminPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]),
    [products, setProducts] = useState([]),
    [instructors, setInstructors] = useState([]),
    [filters, setFilters] = useState({ status: "", search: "" }),
    [form, setForm] = useState({
      productId: "",
      instructorId: "",
      meetingProvider: "custom",
    }),
    [error, setError] = useState(""),
    [msg, setMsg] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ limit: "100" });
      if (filters.status) q.set("status", filters.status);
      if (filters.search.trim()) q.set("search", filters.search.trim());
      const [list, prod, inst] = await Promise.all([
        admin.liveCourses(q.toString()),
        admin.products("type=live_course&limit=100"),
        admin.instructors("status=active&limit=100"),
      ]);
      setRows(list.data || []);
      setProducts(prod.data || []);
      setInstructors(inst.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [filters.status]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("product") || "";
    if (q) setForm((f) => ({ ...f, productId: q }));
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const r = await admin.createLiveCourse(form);
      setMsg(r.message || "Live course created.");
      if (r.data?._id) router.push(`/admin/live-courses/${r.data._id}`);
      else await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <AdminHeader
        title="Live Courses"
        description="Real live-course list, product lookup, instructor selection, batches and sessions."
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{msg}</Notice>
      <div className="admin-split">
        <div className="admin-panel" style={{ marginTop: 0 }}>
          <div className="admin-toolbar">
            <input
              placeholder="Search title or slug"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button className="admin-mini-btn primary" onClick={load}>
              Search
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Instructor</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.product?._id}>
                    <td>
                      <strong>{row.product?.title}</strong>
                      <div>{row.product?.slug}</div>
                    </td>
                    <td>
                      {row.liveCourse?.instructor?.name || "Not configured"}
                    </td>
                    <td>{row.liveCourse?.meetingProvider || "—"}</td>
                    <td>
                      <Status value={row.product?.status} />
                    </td>
                    <td>
                      {row.liveCourse?._id ? (
                        <button
                          className="admin-mini-btn primary"
                          onClick={() =>
                            router.push(
                              `/admin/live-courses/${row.liveCourse._id}`,
                            )
                          }
                        >
                          Manage
                        </button>
                      ) : (
                        <button
                          className="admin-mini-btn"
                          onClick={() =>
                            setForm({ ...form, productId: row.product._id })
                          }
                        >
                          Configure
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="5">Loading live courses…</td>
                  </tr>
                )}
                {!loading && !rows.length && (
                  <tr>
                    <td colSpan="5">No live courses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-panel admin-sticky" style={{ marginTop: 0 }}>
          <h2>Create live-course config</h2>
          <form className="admin-form" onSubmit={submit}>
            <div className="admin-field wide">
              <label>Live product</label>
              <select
                required
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field wide">
              <label>Instructor</label>
              <select
                required
                value={form.instructorId}
                onChange={(e) =>
                  setForm({ ...form, instructorId: e.target.value })
                }
              >
                <option value="">Select active instructor</option>
                {instructors.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.name} · {i.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field wide">
              <label>Meeting provider</label>
              <select
                value={form.meetingProvider}
                onChange={(e) =>
                  setForm({ ...form, meetingProvider: e.target.value })
                }
              >
                <option value="custom">Custom</option>
                <option value="zoom">Zoom</option>
                <option value="google_meet">Google Meet</option>
                <option value="teams">Teams</option>
              </select>
            </div>
            <button className="btn primary wide" disabled={busy}>
              {busy ? "Creating…" : "Create & Manage"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
