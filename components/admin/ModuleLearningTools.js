"use client";

import { useEffect, useMemo, useState } from "react";
import { admin } from "@/lib/admin-api";
import { Notice, Status } from "@/components/admin/AdminUI";

function resourceTypeLabel(type) {
  return {
    pdf: "PDF",
    practice_file: "Practice file",
    ppt: "PPT",
    external_link: "External link",
  }[type] || type;
}

export function ModuleResourcesManager({ moduleId }) {
  const empty = {
    title: "",
    type: "pdf",
    url: "",
    fileName: "",
    order: 0,
    downloadable: true,
    active: true,
  };

  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setError("");
      const result = await admin.moduleResources(moduleId);
      setResources(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [moduleId]);

  function editResource(resource) {
    setEditingId(resource._id);
    setForm({
      title: resource.title || "",
      type: resource.type || "pdf",
      url: resource.url || "",
      fileName: resource.fileName || "",
      order: resource.order ?? 0,
      downloadable: resource.downloadable !== false,
      active: resource.active !== false,
    });
    setMessage("");
    setError("");
  }

  function reset() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const body = {
        ...form,
        order: Number(form.order) || 0,
      };
      if (editingId) {
        await admin.updateModuleResource(editingId, body);
        setMessage("Resource updated.");
      } else {
        await admin.createModuleResource(moduleId, body);
        setMessage("Resource added.");
      }
      reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(resource) {
    if (!confirm(`Delete resource ${resource.title}?`)) return;
    try {
      setError("");
      await admin.deleteModuleResource(resource._id);
      setMessage("Resource deleted.");
      if (editingId === resource._id) reset();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-tool-card">
      <div className="admin-tool-title">
        <div>
          <span className="admin-eyebrow">Module materials</span>
          <h4>Resources</h4>
        </div>
        <span className="admin-count-pill">{resources.length}</span>
      </div>

      <Notice tone="error">{error}</Notice>
      <Notice tone="success">{message}</Notice>

      {resources.length > 0 ? (
        <div className="admin-resource-list">
          {resources.map((resource) => (
            <div className="admin-resource-row" key={resource._id}>
              <div className="admin-resource-main">
                <strong>{resource.title}</strong>
                <small>
                  {resourceTypeLabel(resource.type)} · order {resource.order ?? 0}
                  {resource.fileName ? ` · ${resource.fileName}` : ""}
                </small>
                <a href={resource.url} target="_blank" rel="noreferrer">
                  {resource.url}
                </a>
              </div>
              <div className="admin-resource-meta">
                <Status value={resource.active === false ? "inactive" : "active"} />
                <div className="admin-actions">
                  <button className="admin-mini-btn" type="button" onClick={() => editResource(resource)}>
                    Edit
                  </button>
                  <button className="admin-mini-btn danger" type="button" onClick={() => remove(resource)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty-copy">No module resources yet.</p>
      )}

      <form className="admin-form admin-tool-form" onSubmit={submit}>
        <div className="admin-field wide">
          <label>{editingId ? "Edit resource title" : "Resource title"}</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Workbook practice file"
          />
        </div>
        <div className="admin-field">
          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="pdf">PDF</option>
            <option value="practice_file">Practice file</option>
            <option value="ppt">PPT</option>
            <option value="external_link">External link</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Order</label>
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </div>
        <div className="admin-field wide">
          <label>Resource URL</label>
          <input
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="admin-field wide">
          <label>File name (optional)</label>
          <input
            value={form.fileName}
            onChange={(e) => setForm({ ...form, fileName: e.target.value })}
            placeholder="practice.xlsx"
          />
        </div>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.downloadable}
            onChange={(e) => setForm({ ...form, downloadable: e.target.checked })}
          />
          Downloadable
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
        <div className="wide admin-actions">
          <button className="admin-mini-btn primary" disabled={busy}>
            {busy ? "Saving..." : editingId ? "Update Resource" : "Add Resource"}
          </button>
          {editingId ? (
            <button className="admin-mini-btn" type="button" onClick={reset}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export function ModuleQuizManager({ moduleId }) {
  const [quizData, setQuizData] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "Module Quiz", passPercentage: 100, timeLimitMinutes: "", maxAttempts: 1,
    required: true, showResult: true, showCorrectAnswer: false, randomizeQuestions: false, active: true,
  });
  const [editForm, setEditForm] = useState(null);
  const [question, setQuestion] = useState({ question: "", correctAnswer: true, marks: 1, order: 0 });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setBusy(true); setError("");
    try {
      const result = await admin.moduleQuiz(moduleId);
      setQuizData(result.data || null);
      if (result.data?.quiz) {
        const q = result.data.quiz;
        setEditForm({
          title: q.title || "", passPercentage: q.passPercentage ?? 100,
          timeLimitMinutes: q.timeLimitMinutes ?? "", maxAttempts: q.maxAttempts ?? 1,
          required: q.required !== false, showResult: q.showResult !== false,
          showCorrectAnswer: !!q.showCorrectAnswer, randomizeQuestions: !!q.randomizeQuestions,
          active: q.active !== false,
        });
      } else setEditForm(null);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  useEffect(() => { load(); }, [moduleId]);

  async function createQuiz(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      await admin.createQuiz(moduleId, {
        ...createForm,
        passPercentage: Number(createForm.passPercentage) || 100,
        maxAttempts: Number(createForm.maxAttempts) || 1,
        timeLimitMinutes: createForm.timeLimitMinutes ? Number(createForm.timeLimitMinutes) : undefined,
      });
      setMessage("Quiz created."); await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function saveQuiz(event) {
    event.preventDefault(); if (!quizData?.quiz?._id) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await admin.updateQuiz(quizData.quiz._id, {
        ...editForm,
        passPercentage: Number(editForm.passPercentage) || 100,
        maxAttempts: Number(editForm.maxAttempts) || 1,
        timeLimitMinutes: editForm.timeLimitMinutes ? Number(editForm.timeLimitMinutes) : undefined,
      });
      setMessage("Quiz updated."); await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function removeQuiz() {
    if (!quizData?.quiz?._id || !confirm("Delete this quiz and all its questions/attempts?")) return;
    setBusy(true); setError(""); setMessage("");
    try { await admin.deleteQuiz(quizData.quiz._id); setQuizData(null); setEditForm(null); setMessage("Quiz deleted."); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitQuestion(event) {
    event.preventDefault(); if (!quizData?.quiz?._id) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const body = { question: question.question, correctAnswer: !!question.correctAnswer, marks: Number(question.marks)||1, order: Number(question.order)||0 };
      if (editingQuestion) {
        await admin.updateQuizQuestion(editingQuestion, body); setMessage("Question updated.");
      } else {
        await admin.addQuizQuestion(quizData.quiz._id, body); setMessage("Question added.");
      }
      setEditingQuestion(null); setQuestion({ question: "", correctAnswer: true, marks: 1, order: 0 }); await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function editQuestion(item) {
    setEditingQuestion(item._id);
    setQuestion({ question: item.question || "", correctAnswer: !!item.correctAnswer, marks: item.marks ?? 1, order: item.order ?? 0 });
  }

  async function removeQuestion(item) {
    if (!confirm(`Delete question: ${item.question}?`)) return;
    try { setError(""); await admin.deleteQuizQuestion(item._id); setMessage("Question deleted."); await load(); }
    catch (err) { setError(err.message); }
  }

  const form = editForm || createForm;
  const setForm = editForm ? setEditForm : setCreateForm;

  return (
    <div className="admin-tool-card">
      <div className="admin-tool-title"><div><span className="admin-eyebrow">Assessment</span><h4>True / False Quiz</h4></div>{quizData?.quiz ? <Status value={quizData.quiz.active === false ? "inactive" : "active"} /> : null}</div>
      <Notice tone="error">{error}</Notice><Notice tone="success">{message}</Notice>

      <form className="admin-form admin-tool-form" onSubmit={quizData?.quiz ? saveQuiz : createQuiz}>
        <div className="admin-field wide"><label>Quiz title</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
        <div className="admin-field"><label>Pass percentage</label><input type="number" min="0" max="100" value={form.passPercentage} onChange={e=>setForm({...form,passPercentage:e.target.value})}/></div>
        <div className="admin-field"><label>Time limit (minutes)</label><input type="number" min="1" value={form.timeLimitMinutes} onChange={e=>setForm({...form,timeLimitMinutes:e.target.value})} placeholder="Optional"/></div>
        <div className="admin-field"><label>Max attempts</label><input type="number" min="1" value={form.maxAttempts} onChange={e=>setForm({...form,maxAttempts:e.target.value})}/></div>
        <label className="admin-check"><input type="checkbox" checked={form.required} onChange={e=>setForm({...form,required:e.target.checked})}/>Required</label>
        <label className="admin-check"><input type="checkbox" checked={form.showResult} onChange={e=>setForm({...form,showResult:e.target.checked})}/>Show result</label>
        <label className="admin-check"><input type="checkbox" checked={form.showCorrectAnswer} onChange={e=>setForm({...form,showCorrectAnswer:e.target.checked})}/>Show correct answer</label>
        <label className="admin-check"><input type="checkbox" checked={form.randomizeQuestions} onChange={e=>setForm({...form,randomizeQuestions:e.target.checked})}/>Randomize</label>
        <label className="admin-check"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/>Active</label>
        <div className="wide admin-actions"><button className="admin-mini-btn primary" disabled={busy}>{busy?"Saving…":quizData?.quiz?"Update Quiz":"Create Quiz"}</button>{quizData?.quiz&&<button className="admin-mini-btn danger" type="button" onClick={removeQuiz} disabled={busy}>Delete Quiz</button>}</div>
      </form>

      {quizData?.quiz && <>
        <div className="admin-quiz-summary"><div><span>Title</span><strong>{quizData.quiz.title}</strong></div><div><span>Required</span><strong>{quizData.quiz.required?"Yes":"No"}</strong></div><div><span>Pass</span><strong>{quizData.quiz.passPercentage ?? 100}%</strong></div><div><span>Questions</span><strong>{quizData.questions?.length||0}</strong></div></div>
        <div className="admin-question-list">{(quizData.questions||[]).map(item=><div className="admin-question-row" key={item._id}><span className="admin-question-index">{item.order??0}</span><div><strong>{item.question}</strong><small>Correct: {item.correctAnswer?"True":"False"} · Marks: {item.marks??1}</small></div><div className="admin-actions"><button className="admin-mini-btn" type="button" onClick={()=>editQuestion(item)}>Edit</button><button className="admin-mini-btn danger" type="button" onClick={()=>removeQuestion(item)}>Delete</button></div></div>)}{!quizData.questions?.length&&<p className="admin-empty-copy">No questions yet.</p>}</div>
        <form className="admin-form admin-tool-form" onSubmit={submitQuestion}><div className="admin-field wide"><label>{editingQuestion?"Edit question":"Question"}</label><textarea required value={question.question} onChange={e=>setQuestion({...question,question:e.target.value})}/></div><div className="admin-field"><label>Correct answer</label><select value={question.correctAnswer?"true":"false"} onChange={e=>setQuestion({...question,correctAnswer:e.target.value==="true"})}><option value="true">True</option><option value="false">False</option></select></div><div className="admin-field"><label>Marks</label><input type="number" min="1" value={question.marks} onChange={e=>setQuestion({...question,marks:e.target.value})}/></div><div className="admin-field"><label>Order</label><input type="number" min="0" value={question.order} onChange={e=>setQuestion({...question,order:e.target.value})}/></div><div className="wide admin-actions"><button className="admin-mini-btn primary" disabled={busy}>{busy?"Saving…":editingQuestion?"Update Question":"Add Question"}</button>{editingQuestion&&<button className="admin-mini-btn" type="button" onClick={()=>{setEditingQuestion(null);setQuestion({question:"",correctAnswer:true,marks:1,order:0})}}>Cancel</button>}<button className="admin-mini-btn" type="button" onClick={load}>Refresh</button></div></form>
      </>}
    </div>
  );
}

export default function ModuleLearningTools({ moduleId }) {
  return (
    <div className="admin-learning-tools">
      <ModuleResourcesManager moduleId={moduleId} />
      <ModuleQuizManager moduleId={moduleId} />
    </div>
  );
}
