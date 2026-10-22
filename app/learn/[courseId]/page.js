"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import CourseQuizPanel from "@/components/CourseQuizPanel";

function VideoPlayer({ lesson }) {
  if (!lesson) {
    return <div className="learn-video"><div className="learn-video-empty"><strong>Choose a lesson</strong><span>Select a lesson from the curriculum to start learning.</span></div></div>;
  }

  if (lesson.provider === "youtube" && lesson.videoId) {
    return <div className="learn-video"><iframe src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>;
  }

  if (lesson.provider === "bunny" && lesson.videoId) {
    const src = lesson.videoId.startsWith("http") ? lesson.videoId : `https://iframe.mediadelivery.net/embed/${lesson.videoId}`;
    return <div className="learn-video"><iframe src={src} title={lesson.title} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
  }

  return <div className="learn-video"><div className="learn-video-empty"><strong>{lesson.title}</strong><span>Video is not available for this lesson yet.</span></div></div>;
}

export default function LearnPage() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selected, setSelected] = useState(null);
  const [playback, setPlayback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch(`/enrollments/me/${courseId}`),
      apiFetch(`/progress/courses/${courseId}`),
    ])
      .then(([courseResult, progressResult]) => {
        if (cancelled) return;
        const data = courseResult.data;
        const progressData = progressResult.data;
        setCourseData(data);
        setProgress(progressData);

        const lessons = data?.curriculum?.flatMap((m) => m.lessons || []) || [];
        const remembered = typeof window !== "undefined" ? localStorage.getItem(`lc_last_lesson_${courseId}`) : null;
        const initial = lessons.find((lesson) => String(lesson._id) === String(remembered))
          || lessons.find((lesson) => String(lesson._id) === String(progressData?.lastLesson?._id))
          || lessons[0]
          || null;
        setSelected(initial);
      })
      .catch((e) => setMessage(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [courseId]);

  useEffect(() => {
    if (!selected?._id) return setPlayback(null);
    localStorage.setItem(`lc_last_lesson_${courseId}`, String(selected._id));
    setPlayback(null);
    setMessage("");
    apiFetch(`/courses/lessons/${selected._id}/playback`)
      .then((x) => setPlayback(x.data?.lesson || null))
      .catch((e) => setMessage(e.message));
  }, [selected, courseId]);

  const lessons = useMemo(() => courseData?.curriculum?.flatMap((m) => m.lessons || []) || [], [courseData]);
  const selectedIndex = useMemo(() => lessons.findIndex((x) => String(x._id) === String(selected?._id)), [lessons, selected]);
  const completed = useMemo(() => new Set((progress?.completedLessons || []).map((x) => String(x._id))), [progress]);
  const percent = Math.max(0, Math.min(100, Math.round(progress?.progressPercent || 0)));

  async function refreshProgress() {
    const next = await apiFetch(`/progress/courses/${courseId}`);
    setProgress(next.data);
  }

  async function markComplete() {
    if (!selected?._id) return;
    try {
      setMessage("Saving progress...");
      await apiFetch(`/progress/courses/${courseId}/lessons/${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify({ watchedSeconds: selected.video?.duration || playback?.duration || 0, completed: true }),
      });
      await refreshProgress();
      setMessage("Lesson completed.");

      const nextLesson = lessons[selectedIndex + 1];
      if (nextLesson) setSelected(nextLesson);
    } catch (e) {
      setMessage(e.message);
    }
  }

  function moveLesson(offset) {
    const next = lessons[selectedIndex + offset];
    if (next) setSelected(next);
  }

  if (loading) return <section className="section"><div className="container"><p>Loading course...</p></div></section>;
  if (!courseData) return <section className="section"><div className="container"><div className="product-list-empty">{message || "Course access is unavailable."}</div></div></section>;

  return (
    <section className="learn-shell">
      <div className="learn-topbar">
        <div>
          <Link href="/dashboard/courses" className="learn-back">← My Courses</Link>
          <h1>{courseData.product?.title}</h1>
        </div>
        <div className="learn-progress-summary">
          <div><span>Progress</span><strong>{percent}%</strong></div>
          <div className="progress-bar wide"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
        </div>
      </div>

      <div className="learn-grid">
        <main className="learn-main">
          {activeQuiz ? (
            <CourseQuizPanel quizId={activeQuiz._id} title={activeQuiz.title} onClose={() => setActiveQuiz(null)} onProgressChanged={refreshProgress} />
          ) : (
            <>
          <VideoPlayer lesson={playback} />

          <div className="learn-lesson-head">
            <div>
              <span className="ey">CURRENT LESSON</span>
              <h2>{selected?.title || "Choose a lesson"}</h2>
              {selected?.video?.duration ? <p>{Math.ceil(selected.video.duration / 60)} min lesson</p> : null}
            </div>
            {selected && <span className={`lesson-status${completed.has(String(selected._id)) ? " done" : ""}`}>{completed.has(String(selected._id)) ? "Completed" : "In progress"}</span>}
          </div>

          <div className="learn-actions">
            <button className="btn ghost" type="button" disabled={selectedIndex <= 0} onClick={() => moveLesson(-1)}>← Previous</button>
            <button className="btn primary" type="button" disabled={!selected} onClick={markComplete}>Mark Complete</button>
            <button className="btn ghost" type="button" disabled={selectedIndex < 0 || selectedIndex >= lessons.length - 1} onClick={() => moveLesson(1)}>Next →</button>
          </div>

          {message && <div className="learn-message">{message}</div>}
            </>
          )}
        </main>

        <aside className="learn-curriculum">
          <div className="learn-curriculum-head">
            <div><span className="ey">CURRICULUM</span><h2>Course Content</h2></div>
            <span>{lessons.length} lessons</span>
          </div>

          <div className="learn-module-list">
            {(courseData.curriculum || []).map((module, moduleIndex) => (
              <details className="learn-module" key={module._id} open={moduleIndex === 0 || (module.lessons || []).some((l) => String(l._id) === String(selected?._id))}>
                <summary>
                  <span>{module.title}</span>
                  <small>{module.lessons?.length || 0} lessons</small>
                </summary>
                <div className="learn-lesson-list">
                  {(module.lessons || []).map((lesson) => {
                    const isSelected = String(selected?._id) === String(lesson._id);
                    const isDone = completed.has(String(lesson._id));
                    return (
                      <button key={lesson._id} type="button" className={`learn-lesson-button${isSelected ? " active" : ""}`} onClick={() => { setSelected(lesson); setActiveQuiz(null); }}>
                        <span className={`lesson-dot${isDone ? " done" : ""}`}>{isDone ? "✓" : "▶"}</span>
                        <span><strong>{lesson.title}</strong><small>{lesson.video?.duration ? `${Math.ceil(lesson.video.duration / 60)} min` : "Lesson"}</small></span>
                      </button>
                    );
                  })}
                  {module.quiz && (
                    <button type="button" className={`learn-lesson-button quiz-link${String(activeQuiz?._id) === String(module.quiz._id) ? " active" : ""}`} onClick={() => setActiveQuiz(module.quiz)}>
                      <span className="lesson-dot">?</span>
                      <span><strong>{module.quiz.title || "Module Quiz"}</strong><small>{module.quiz.required ? "Required quiz" : "Quiz"}</small></span>
                    </button>
                  )}
                </div>
              </details>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
