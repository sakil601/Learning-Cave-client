"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Empty, Notice, Status } from "@/components/admin/AdminUI";

const blank = {
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
  level: "beginner",
  language: "en",
  estimatedDuration: "",
  autoCompleteVideoPercentage: 90,
  certificateEnabled: true,
  certificateQuizPassPercentage: 80,
  instructor: "",
};
export default function CoursesPage() {
  const [items, setItems] = useState([]),
    [cats, setCats] = useState([]),
    [form, setForm] = useState(blank),
    [error, setError] = useState(""),
    [msg, setMsg] = useState(""),
    [search, setSearch] = useState("");
  const load = async () => {
    try {
      const q = new URLSearchParams({ limit: "100" });
      if (search) q.set("search", search);
      const [c, cat] = await Promise.all([
        admin.courses(q.toString()),
        admin.categories(false),
      ]);
      setItems(c.data || []);
      setCats(cat.data || []);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const body = {
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
        level: form.level,
        language: form.language,
        autoCompleteVideoPercentage: Number(form.autoCompleteVideoPercentage),
        certificateEnabled: form.certificateEnabled,
        certificateQuizPassPercentage: Number(
          form.certificateQuizPassPercentage,
        ),
        instructor: form.instructor,
      };
      if (form.slug) body.slug = form.slug;
      if (form.salePrice !== "") body.salePrice = Number(form.salePrice);
      if (form.estimatedDuration !== "")
        body.estimatedDuration = Number(form.estimatedDuration);
      if (form.accessType === "limited") {
        body.access.duration = Number(form.accessDuration);
        body.access.durationUnit = form.accessUnit;
      }
      await admin.createCourse(body);
      setMsg("Recorded course created as draft.");
      setForm(blank);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const action = async (id, name) => {
    try {
      await admin.courseAction(id, name);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <AdminHeader
        title="Recorded Courses"
        description="Create recorded courses and manage their draft/review/published lifecycle. Active instructor ObjectId is required by the current backend."
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{msg}</Notice>
      <div className="admin-toolbar">
        <input
          placeholder="Search course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="admin-mini-btn primary" onClick={load}>
          Search
        </button>
      </div>
      <div className="admin-split">
        <div>
          {items.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((x) => {
                    const p = x.product || {};
                    return (
                      <tr key={x._id}>
                        <td>
                          <strong>{p.title}</strong>
                          <div className="admin-code">{p.slug}</div>
                        </td>
                        <td>{x.instructor?.name || "—"}</td>
                        <td>
                          <Status value={p.status} />
                        </td>
                        <td>
                          <div className="admin-actions">
                            <Link
                              className="admin-mini-btn primary"
                              href={`/admin/courses/${x._id}`}
                            >
                              Manage
                            </Link>
                            {p.status === "draft" && (
                              <button
                                className="admin-mini-btn"
                                onClick={() => action(x._id, "submit-review")}
                              >
                                Submit review
                              </button>
                            )}
                            {["draft", "review"].includes(p.status) && (
                              <button
                                className="admin-mini-btn"
                                onClick={() => action(x._id, "publish")}
                              >
                                Publish
                              </button>
                            )}
                            {p.status === "review" && (
                              <button
                                className="admin-mini-btn"
                                onClick={() => action(x._id, "reject")}
                              >
                                Reject
                              </button>
                            )}
                            <button
                              className="admin-mini-btn"
                              onClick={() => action(x._id, "archive")}
                            >
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </div>
        <div className="admin-panel admin-sticky" style={{ marginTop: 0 }}>
          <h2>New recorded course</h2>
          <Notice>
            Instructor listing API is not available yet, so enter an active
            instructor ObjectId.
          </Notice>
          <form className="admin-form" onSubmit={submit}>
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
              <label>Instructor ObjectId</label>
              <input
                required
                pattern="[a-fA-F0-9]{24}"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
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
              <label>Tags</label>
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
              Free course
            </label>
            <div className="admin-field">
              <label>Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Language</label>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Estimated duration</label>
              <input
                type="number"
                min="0"
                value={form.estimatedDuration}
                onChange={(e) =>
                  setForm({ ...form, estimatedDuration: e.target.value })
                }
              />
            </div>
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
            <div className="admin-field">
              <label>Video complete %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={form.autoCompleteVideoPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    autoCompleteVideoPercentage: e.target.value,
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label>Quiz pass %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.certificateQuizPassPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    certificateQuizPassPercentage: e.target.value,
                  })
                }
              />
            </div>
            <label className="admin-check wide">
              <input
                type="checkbox"
                checked={form.certificateEnabled}
                onChange={(e) =>
                  setForm({ ...form, certificateEnabled: e.target.checked })
                }
              />
              Certificate enabled
            </label>
            <div className="wide">
              <button className="btn primary" type="submit">
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
