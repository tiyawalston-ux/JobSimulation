"use client";

import { useEffect, useRef, useState } from "react";
import type { Answers, Career } from "@/lib/careers";
import type { ReportData } from "@/lib/report";

export default function ReportView({
  career,
  answers,
  onRestart,
}: {
  career: Career;
  answers: Answers;
  onRestart: () => void;
}) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const requested = useRef(false);

  async function load() {
    setError("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: career.id, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReport(data);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Couldn't load your report.");
    }
  }

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <section className="card">
        <p className="error">{error}</p>
        <button className="btn btn-primary" onClick={load}>Try again</button>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="card intro center">
        <div className="spinner" />
        <h2>That's a wrap!</h2>
        <p className="muted">Your manager is writing up your end-of-day review...</p>
      </section>
    );
  }

  const score = Math.max(0, Math.min(100, Math.round(report.overall_score)));

  return (
    <div className="stack">
      <section className="card report-hero">
        <div className="score-ring" style={{ "--score": score } as React.CSSProperties}>
          <span>{score}</span>
        </div>
        <div>
          <p className="eyebrow">Your day as a {career.title}</p>
          <h1>{report.headline}</h1>
          <p>{report.fit_summary}</p>
        </div>
      </section>

      <section className="card">
        <h2>Skills</h2>
        <div className="skills">
          {report.skills.map((s) => {
            const value = Math.max(0, Math.min(10, s.score));
            return (
              <div key={s.name} className="skill">
                <div className="skill-top">
                  <strong>{s.name}</strong>
                  <span>{value}/10</span>
                </div>
                <div className="bar"><span style={{ width: `${value * 10}%` }} /></div>
                <p className="muted">{s.comment}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <h2>🌟 What you did well</h2>
          <ul>{report.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
        <section className="card">
          <h2>📈 Try next time</h2>
          <ul>{report.improvements.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
      </div>

      <section className="card">
        <h2>Task by task</h2>
        {career.tasks.map((t) => {
          const fb = report.task_feedback.find((f) => f.task_id === t.id);
          return (
            <div key={t.id} className="task-feedback">
              <small>{t.time}</small>
              <strong>{t.title}</strong>
              <p>{fb?.feedback ?? "No feedback for this one."}</p>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2>🧭 Explore this career for real</h2>
        <ul>{report.next_steps.map((h) => <li key={h}>{h}</li>)}</ul>
      </section>

      <div className="actions">
        <a href="/" className="btn">Try another career</a>
        <button className="btn btn-primary" onClick={onRestart}>Replay this day</button>
      </div>
    </div>
  );
}
