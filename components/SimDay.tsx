"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Answers, Career } from "@/lib/careers";
import { DecisionView, InboxView, MeetingView, WritingView } from "./tasks";
import ReportView from "./ReportView";

type Progress = { index: number; answers: Answers };

const ICONS = { inbox: "📥", meeting: "🎥", writing: "✍️", decision: "⚡" } as const;

export default function SimDay({ career }: { career: Career }) {
  const storageKey = `dayone:${career.id}`;
  const [progress, setProgress] = useState<Progress>({ index: -1, answers: {} });
  const [loaded, setLoaded] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Resume where the player left off (saved in this browser only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setProgress(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {}
  }, [progress, loaded, storageKey]);

  const { index, answers } = progress;
  const tasks = career.tasks;
  const task = tasks[index];
  const finished = index >= tasks.length;

  function complete(answer: Answers[string]) {
    setProgress((p) => ({ index: p.index + 1, answers: { ...p.answers, [task.id]: answer } }));
    setScheduleOpen(false);
    window.scrollTo({ top: 0 });
  }

  function restart() {
    setProgress({ index: -1, answers: {} });
  }

  if (!loaded) return null;

  return (
    <div className="sim">
      <header className="topbar">
        <Link href="/" className="back">← Careers</Link>
        <div className="topbar-title">
          <strong>{career.emoji} {career.title}</strong>
          <span>{career.company}</span>
        </div>
        {index >= 0 ? (
          <button
            className="schedule-toggle"
            onClick={() => setScheduleOpen((o) => !o)}
            aria-expanded={scheduleOpen}
            aria-controls="schedule"
          >
            📅 {finished ? "Report" : `${index + 1} / ${tasks.length}`}
          </button>
        ) : (
          <span />
        )}
      </header>

      <div className="sim-body">
        {index >= 0 && (
          <nav id="schedule" className={`schedule ${scheduleOpen ? "open" : ""}`} aria-label="Today's schedule">
            <div className="schedule-head">
              <p className="schedule-label">Today's schedule</p>
              <button className="schedule-close" onClick={() => setScheduleOpen(false)} aria-label="Close schedule">
                ✕
              </button>
            </div>
            <ol>
              {tasks.map((t, i) => (
                <li
                  key={t.id}
                  className={i === index ? "current" : i < index ? "done" : ""}
                >
                  <span className="schedule-icon">{i < index ? "✓" : ICONS[t.type]}</span>
                  <span>
                    <small>{t.time}</small>
                    {t.title}
                  </span>
                </li>
              ))}
              <li className={finished ? "current" : ""}>
                <span className="schedule-icon">📊</span>
                <span>
                  <small>{career.endTime ?? "5:00 PM"}</small>
                  End-of-day report
                </span>
              </li>
            </ol>
          </nav>
        )}
        {scheduleOpen && <div className="scrim" onClick={() => setScheduleOpen(false)} />}

        <main className="stage">
          {index === -1 && (
            <section className="card intro">
              <p className="eyebrow">Your first day</p>
              <h1>Welcome to {career.company}!</h1>
              <p>{career.intro}</p>
              <p>
                You'll work through {tasks.length} parts of a real workday. There are no perfect
                answers. Just do what you think a good {career.title.toLowerCase()} would do.
              </p>
              <p className="muted">⏱ About 20–30 minutes. Your progress saves automatically.</p>
              <button className="btn btn-primary" onClick={() => setProgress((p) => ({ ...p, index: 0 }))}>
                Clock in →
              </button>
            </section>
          )}

          {task && (
            <div key={task.id}>
              <div className="task-head">
                <span className="time">{task.time}</span>
                <h1>{task.title}</h1>
                <p>{task.brief}</p>
              </div>
              {task.type === "inbox" && <InboxView task={task} onDone={complete} />}
              {task.type === "meeting" && <MeetingView careerId={career.id} playerRole={career.yourRole ?? "You"} task={task} onDone={complete} />}
              {task.type === "writing" && <WritingView task={task} onDone={complete} />}
              {task.type === "decision" && <DecisionView task={task} onDone={complete} />}
            </div>
          )}

          {finished && <ReportView career={career} answers={answers} onRestart={restart} />}
        </main>
      </div>
    </div>
  );
}
