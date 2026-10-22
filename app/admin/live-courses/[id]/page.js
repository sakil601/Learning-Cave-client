"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { admin } from "@/lib/admin-api";
import { AdminHeader, Notice, Status } from "@/components/admin/AdminUI";

export default function LiveCourseManager() {
  const { id } = useParams();
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [msg, setMsg] = useState("");
  const [batch, setBatch] = useState({
    name: "",
    startDate: "",
    endDate: "",
    capacity: "",
    enrollmentOpen: "",
    enrollmentClose: "",
  });
  const [sessionForms, setSessionForms] = useState({});
  const load = async () => {
    try {
      setData((await admin.liveCourse(id)).data);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, [id]);
  const createBatch = async (e) => {
    e.preventDefault();
    try {
      await admin.createBatch(id, {
        ...batch,
        capacity: batch.capacity === "" ? undefined : Number(batch.capacity),
        startDate: batch.startDate || undefined,
        endDate: batch.endDate || undefined,
        enrollmentOpen: batch.enrollmentOpen || undefined,
        enrollmentClose: batch.enrollmentClose || undefined,
      });
      setBatch({
        name: "",
        startDate: "",
        endDate: "",
        capacity: "",
        enrollmentOpen: "",
        enrollmentClose: "",
      });
      setMsg("Batch created.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const createSession = async (batchId, e) => {
    e.preventDefault();
    const f = sessionForms[batchId] || {};
    try {
      await admin.createSession(batchId, {
        title: f.title,
        classDate: f.classDate || undefined,
        startsAt: f.startsAt || undefined,
        endsAt: f.endsAt || undefined,
        meetingUrl: f.meetingUrl || undefined,
        joinBeforeMinutes: Number(f.joinBeforeMinutes) || 15,
      });
      setSessionForms({ ...sessionForms, [batchId]: {} });
      setMsg("Session created.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const changeBatch = async (b) => {
    const status = prompt(
      "Batch status: upcoming, ongoing, completed, cancelled",
      b.status,
    );
    if (!status) return;
    try {
      await admin.updateBatch(b._id, { status });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const changeSession = async (s) => {
    const status = prompt(
      "Session status: scheduled, live, completed, cancelled, rescheduled",
      s.status,
    );
    if (!status) return;
    try {
      await admin.updateSession(s._id, { status });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  if (!data)
    return (
      <>
        <AdminHeader title="Live course manager" />
        <Notice tone="error">{error || "Loading..."}</Notice>
      </>
    );
  const lc = data.liveCourse;
  return (
    <>
      <AdminHeader
        title={lc.product?.title || "Live Course"}
        description={`Instructor: ${lc.instructor?.name || "—"} · Provider: ${lc.meetingProvider}`}
        actions={<Status value={lc.product?.status} />}
      />
      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{msg}</Notice>
      <div className="admin-split">
        <div>
          {(data.batches || []).map((b) => (
            <div className="admin-module" key={b._id}>
              <div className="admin-module-head">
                <div>
                  <h3>{b.name}</h3>
                  <small>
                    {b.startDate
                      ? new Date(b.startDate).toLocaleDateString()
                      : "No start"}{" "}
                    →{" "}
                    {b.endDate
                      ? new Date(b.endDate).toLocaleDateString()
                      : "No end"}
                  </small>
                </div>
                <div className="admin-actions">
                  <Status value={b.status} />
                  <button
                    className="admin-mini-btn"
                    onClick={() => changeBatch(b)}
                  >
                    Change status
                  </button>
                </div>
              </div>
              {(data.sessions || [])
                .filter((s) => String(s.batch) === String(b._id))
                .map((s) => (
                  <div className="admin-lesson" key={s._id}>
                    <div>
                      <strong>{s.title}</strong>
                      <small>
                        {" "}
                        ·{" "}
                        {s.startsAt
                          ? new Date(s.startsAt).toLocaleString()
                          : "No time"}
                      </small>
                    </div>
                    <div className="admin-actions">
                      <Status value={s.status} />
                      <button
                        className="admin-mini-btn"
                        onClick={() => changeSession(s)}
                      >
                        Status
                      </button>
                    </div>
                  </div>
                ))}
              <form
                className="admin-form"
                style={{ marginTop: 14 }}
                onSubmit={(e) => createSession(b._id, e)}
              >
                {(() => {
                  const f = sessionForms[b._id] || {};
                  const set = (k, v) =>
                    setSessionForms({
                      ...sessionForms,
                      [b._id]: { ...f, [k]: v },
                    });
                  return (
                    <>
                      <div className="admin-field wide">
                        <label>New session title</label>
                        <input
                          required
                          value={f.title || ""}
                          onChange={(e) => set("title", e.target.value)}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Starts</label>
                        <input
                          type="datetime-local"
                          value={f.startsAt || ""}
                          onChange={(e) => set("startsAt", e.target.value)}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Ends</label>
                        <input
                          type="datetime-local"
                          value={f.endsAt || ""}
                          onChange={(e) => set("endsAt", e.target.value)}
                        />
                      </div>
                      <div className="admin-field wide">
                        <label>Meeting URL</label>
                        <input
                          value={f.meetingUrl || ""}
                          onChange={(e) => set("meetingUrl", e.target.value)}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Join before minutes</label>
                        <input
                          type="number"
                          min="0"
                          value={f.joinBeforeMinutes || 15}
                          onChange={(e) =>
                            set("joinBeforeMinutes", e.target.value)
                          }
                        />
                      </div>
                      <div className="wide">
                        <button className="admin-mini-btn primary">
                          Add Session
                        </button>
                      </div>
                    </>
                  );
                })()}
              </form>
            </div>
          ))}
        </div>
        <div className="admin-panel admin-sticky" style={{ marginTop: 0 }}>
          <h2>Create batch</h2>
          <form className="admin-form" onSubmit={createBatch}>
            <div className="admin-field wide">
              <label>Name</label>
              <input
                required
                value={batch.name}
                onChange={(e) => setBatch({ ...batch, name: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Start date</label>
              <input
                type="date"
                value={batch.startDate}
                onChange={(e) =>
                  setBatch({ ...batch, startDate: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label>End date</label>
              <input
                type="date"
                value={batch.endDate}
                onChange={(e) =>
                  setBatch({ ...batch, endDate: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                value={batch.capacity}
                onChange={(e) =>
                  setBatch({ ...batch, capacity: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label>Enrollment open</label>
              <input
                type="datetime-local"
                value={batch.enrollmentOpen}
                onChange={(e) =>
                  setBatch({ ...batch, enrollmentOpen: e.target.value })
                }
              />
            </div>
            <div className="admin-field wide">
              <label>Enrollment close</label>
              <input
                type="datetime-local"
                value={batch.enrollmentClose}
                onChange={(e) =>
                  setBatch({ ...batch, enrollmentClose: e.target.value })
                }
              />
            </div>
            <div className="wide">
              <button className="btn primary">Create Batch</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
