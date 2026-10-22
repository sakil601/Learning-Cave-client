"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Empty, Notice, Status } from "@/components/admin/AdminUI";

const blank = {
  type: "ebook",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  thumbnail: "",
  categories: [],
  tags: "",
  regularPrice: 0,
  salePrice: "",
  isFree: false,
  accessType: "lifetime",
  accessDuration: "",
  accessUnit: "days",
  status: "draft",
};
const types = ["live_course", "ebook", "digital_product", "bundle"];
export default function ProductsPage() {
  const [items, setItems] = useState([]),
    [cats, setCats] = useState([]),
    [form, setForm] = useState(blank),
    [editing, setEditing] = useState(null),
    [search, setSearch] = useState(""),
    [type, setType] = useState(""),
    [error, setError] = useState(""),
    [msg, setMsg] = useState("");
  const load = async () => {
    try {
      const q = new URLSearchParams({ limit: "100" });
      if (search) q.set("search", search);
      if (type) q.set("type", type);
      const [p, c] = await Promise.all([
        admin.products(q.toString()),
        admin.categories(false),
      ]);
      setItems(p.data || []);
      setCats(c.data || []);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const payload = () => {
    const body = {
      type: form.type,
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      thumbnail: form.thumbnail,
      categories: form.categories,
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      regularPrice: Number(form.regularPrice) || 0,
      isFree: form.isFree,
      access: { type: form.accessType },
    };
    if (form.slug) body.slug = form.slug;
    if (form.salePrice !== "") body.salePrice = Number(form.salePrice);
    if (form.accessType === "limited") {
      body.access.duration = Number(form.accessDuration);
      body.access.durationUnit = form.accessUnit;
    }
    if (editing) body.status = form.status;
    return body;
  };
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      if (editing) await admin.updateProduct(editing, payload());
      else await admin.createProduct(payload());
      setMsg(editing ? "Product updated." : "Product created as draft.");
      setEditing(null);
      setForm(blank);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const edit = (x) => {
    if (x.type === "recorded_course") return;
    setEditing(x._id);
    setForm({
      type: x.type,
      title: x.title || "",
      slug: x.slug || "",
      shortDescription: x.shortDescription || "",
      description: x.description || "",
      thumbnail: x.thumbnail || "",
      categories: (x.categories || []).map((c) => c._id || c),
      tags: (x.tags || []).join(", "),
      regularPrice: x.regularPrice || 0,
      salePrice: x.salePrice ?? "",
      isFree: !!x.isFree,
      accessType: x.access?.type || "lifetime",
      accessDuration: x.access?.duration || "",
      accessUnit: x.access?.durationUnit || "days",
      status: x.status || "draft",
    });
  };
  const remove = async (id) => {
    if (!confirm("Soft-delete this product?")) return;
    try {
      await admin.deleteProduct(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const configHref = (x) =>
    x.type === "ebook"
      ? "/admin/ebooks"
      : x.type === "digital_product"
        ? "/admin/digital-products"
        : x.type === "bundle"
          ? "/admin/bundles"
          : x.type === "live_course"
            ? "/admin/live-courses"
            : null;
  return (
    <>
      <AdminHeader
        title="Products"
        description="Generic products are used for live courses, e-books, digital products and bundles. Recorded courses use their dedicated course endpoint."
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{msg}</Notice>
      <div className="admin-toolbar">
        <input
          placeholder="Search title or slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {["recorded_course", ...types].map((x) => (
            <option key={x} value={x}>
              {x.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button className="admin-mini-btn primary" onClick={load}>
          Filter
        </button>
      </div>
      <div className="admin-split">
        <div>
          {items.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((x) => (
                    <tr key={x._id}>
                      <td>
                        <strong>{x.title}</strong>
                        <div className="admin-code">{x.slug}</div>
                      </td>
                      <td>{x.type.replaceAll("_", " ")}</td>
                      <td>
                        {x.isFree
                          ? "Free"
                          : `৳${x.salePrice ?? x.regularPrice ?? 0}`}
                      </td>
                      <td>
                        <Status value={x.status} />
                      </td>
                      <td>
                        <div className="admin-actions">
                          {x.type !== "recorded_course" && (
                            <button
                              className="admin-mini-btn"
                              onClick={() => edit(x)}
                            >
                              Edit
                            </button>
                          )}
                          {configHref(x) && (
                            <Link
                              className="admin-mini-btn"
                              href={`${configHref(x)}?product=${x._id}`}
                            >
                              Configure
                            </Link>
                          )}
                          {x.type !== "recorded_course" && (
                            <button
                              className="admin-mini-btn danger"
                              onClick={() => remove(x._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </div>
        <div className="admin-panel admin-sticky" style={{ marginTop: 0 }}>
          <h2>{editing ? "Edit product" : "New product"}</h2>
          <form className="admin-form" onSubmit={submit}>
            <div className="admin-field">
              <label>Type</label>
              <select
                disabled={!!editing}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {types.map((x) => (
                  <option key={x} value={x}>
                    {x.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            {editing && (
              <div className="admin-field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["draft", "review", "published", "archived"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="admin-field wide">
              <label>Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="admin-field wide">
              <label>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="admin-field wide">
              <label>Short description</label>
              <textarea
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
              />
            </div>
            <div className="admin-field wide">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="admin-field wide">
              <label>Thumbnail URL</label>
              <input
                value={form.thumbnail}
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.value })
                }
              />
            </div>
            <div className="admin-field wide">
              <label>Categories</label>
              <select
                multiple
                value={form.categories}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categories: [...e.target.selectedOptions].map(
                      (o) => o.value,
                    ),
                  })
                }
              >
                {cats.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field wide">
              <label>Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Regular price</label>
              <input
                type="number"
                min="0"
                value={form.regularPrice}
                onChange={(e) =>
                  setForm({ ...form, regularPrice: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label>Sale price</label>
              <input
                type="number"
                min="0"
                value={form.salePrice}
                onChange={(e) =>
                  setForm({ ...form, salePrice: e.target.value })
                }
              />
            </div>
            <label className="admin-check wide">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
              />
              Free product
            </label>
            <div className="admin-field">
              <label>Access</label>
              <select
                value={form.accessType}
                onChange={(e) =>
                  setForm({ ...form, accessType: e.target.value })
                }
              >
                <option value="lifetime">Lifetime</option>
                <option value="limited">Limited</option>
              </select>
            </div>
            {form.accessType === "limited" && (
              <>
                <div className="admin-field">
                  <label>Duration</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.accessDuration}
                    onChange={(e) =>
                      setForm({ ...form, accessDuration: e.target.value })
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Unit</label>
                  <select
                    value={form.accessUnit}
                    onChange={(e) =>
                      setForm({ ...form, accessUnit: e.target.value })
                    }
                  >
                    <option>days</option>
                    <option>months</option>
                    <option>years</option>
                  </select>
                </div>
              </>
            )}
            <div className="wide admin-actions">
              <button className="btn primary" type="submit">
                {editing ? "Save Product" : "Create Draft"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setEditing(null);
                    setForm(blank);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
