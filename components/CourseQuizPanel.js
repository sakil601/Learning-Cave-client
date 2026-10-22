"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CourseQuizPanel({ quizId, title, onClose, onProgressChanged }) {
  const [data,setData]=useState(null),[attempt,setAttempt]=useState(null),[answers,setAnswers]=useState({}),[result,setResult]=useState(null),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState("");

  async function load(){setLoading(true);setError("");try{const r=await apiFetch(`/quizzes/${quizId}`);setData(r.data)}catch(e){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[quizId]);

  async function start(){setBusy(true);setError("");try{const r=await apiFetch(`/quizzes/${quizId}/attempts`,{method:"POST"});setAttempt(r.data)}catch(e){setError(e.message)}finally{setBusy(false)}}
  async function submit(){if(!attempt?._id)return;setBusy(true);setError("");try{const payload=(data.questions||[]).map(q=>({question:q._id,answer:answers[q._id]})).filter(x=>typeof x.answer==="boolean");const r=await apiFetch(`/quizzes/${quizId}/attempts/${attempt._id}/submit`,{method:"POST",body:JSON.stringify({answers:payload})});setResult(r.data);setAttempt(null);if(r.data?.completed){await load();onProgressChanged?.()}}catch(e){setError(e.message)}finally{setBusy(false)}}

  if(loading)return <div className="quiz-panel"><p>Loading quiz…</p></div>;
  if(error&&!data)return <div className="quiz-panel"><div className="learn-message">{error}</div><button className="btn ghost" onClick={onClose}>Back to lessons</button></div>;

  if(data?.completed)return <div className="quiz-panel"><span className="ey">MODULE QUIZ</span><h2>{data.quiz?.title||title||"Quiz"}</h2><div className="quiz-complete-card"><strong>100%</strong><p>Quiz completed successfully.</p></div><button className="btn ghost" onClick={onClose}>Back to lessons</button></div>;

  return <div className="quiz-panel"><div className="quiz-panel-head"><div><span className="ey">MODULE QUIZ</span><h2>{data?.quiz?.title||title||"Quiz"}</h2><p>{data?.quiz?.timeLimitMinutes?`${data.quiz.timeLimitMinutes} minute limit · `:""}{data?.questions?.length||0} True/False questions</p></div><button className="btn ghost" onClick={onClose}>Close</button></div>{error&&<div className="learn-message">{error}</div>}{result&&<div className={`quiz-result ${result.completed?"done":""}`}><strong>{result.percentage}%</strong><span>{result.completed?"Completed":"Try again for 100%"}</span></div>}{!attempt?<button className="btn primary" onClick={start} disabled={busy}>{busy?"Starting…":"Start Quiz"}</button>:<><div className="quiz-question-list">{(data.questions||[]).map((q,index)=><div className="quiz-question-card" key={q._id}><strong>{index+1}. {q.question}</strong><div className="quiz-answer-row"><button type="button" className={answers[q._id]===true?"selected":""} onClick={()=>setAnswers({...answers,[q._id]:true})}>True</button><button type="button" className={answers[q._id]===false?"selected":""} onClick={()=>setAnswers({...answers,[q._id]:false})}>False</button></div></div>)}</div><button className="btn primary" onClick={submit} disabled={busy||Object.keys(answers).length<(data.questions?.length||0)}>{busy?"Submitting…":"Submit Quiz"}</button></>}</div>;
}
