"use client";

import { useEffect, useRef, useState } from "react";
import {
  inboxActions,
  type Answers,
  type DecisionTask,
  type InboxTask,
  type MeetingTask,
  type TranscriptLine,
  type WritingTask,
} from "@/lib/careers";
import { postJSON } from "@/lib/api";

type OnDone = (answer: Answers[string]) => void;

export function InboxView({ task, onDone }: { task: InboxTask; onDone: OnDone }) {
  const [actions, setActions] = useState<Record<string, string>>({});
  const options = inboxActions(task);
  const allDecided = task.emails.every((e) => actions[e.id]);

  return (
    <div className="stack">
      {task.emails.map((email) => (
        <article key={email.id} className="card email">
          <div className="email-meta">
            <strong>{email.from}</strong>
            <span>{email.subject}</span>
          </div>
          <p>{email.body}</p>
          <div className="choice-row" role="radiogroup" aria-label={`Action for ${email.subject}`}>
            {options.map((a) => (
              <button
                key={a.id}
                role="radio"
                aria-checked={actions[email.id] === a.id}
                className={`chip ${actions[email.id] === a.id ? "selected" : ""}`}
                onClick={() => setActions((prev) => ({ ...prev, [email.id]: a.id }))}
              >
                {a.label}
              </button>
            ))}
          </div>
        </article>
      ))}
      <div className="actions">
        <span className="muted">
          {Object.keys(actions).length} of {task.emails.length} decided
        </span>
        <button className="btn btn-primary" disabled={!allDecided} onClick={() => onDone({ type: "inbox", actions })}>
          {task.doneLabel ?? "Done with inbox →"}
        </button>
      </div>
    </div>
  );
}

// --- Meeting -----------------------------------------------------------------

// Minimal typing for the browser's built-in speech recognition (Chrome, Safari, Edge).
type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function MeetingView({
  careerId,
  playerRole,
  task,
  onDone,
}: {
  careerId: string;
  playerRole: string;
  task: MeetingTask;
  onDone: OnDone;
}) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const turnsUsed = transcript.filter((l) => l.speaker === "You").length;
  const turnsLeft = task.maxTurns - turnsUsed;

  useEffect(() => setMicSupported(getRecognition() !== null), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, loading]);

  function speak(lines: TranscriptLine[]) {
    if (!voiceOn || !("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    for (const line of lines) {
      const u = new SpeechSynthesisUtterance(line.text);
      const idx = task.personas.findIndex((p) => p.name === line.speaker);
      if (voices.length) u.voice = voices[(idx * 3) % voices.length];
      u.onstart = () => setSpeaking(line.speaker);
      u.onend = () => setSpeaking(null);
      speechSynthesis.speak(u);
    }
  }

  async function advance(next: TranscriptLine[]) {
    setLoading(true);
    setError("");
    try {
      const res = await postJSON("/api/meeting", { careerId, taskId: task.id, transcript: next });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTranscript([...next, ...data.lines]);
      speak(data.lines);
      if (data.meeting_over || next.filter((l) => l.speaker === "You").length >= task.maxTurns) setOver(true);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Connection problem. Try again.");
      setTranscript(next);
    } finally {
      setLoading(false);
    }
  }

  // The coworkers open the meeting.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    advance([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function send() {
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    advance([...transcript, { speaker: "You", text }]);
  }

  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = getRecognition();
    if (!rec) return;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => setDraft((d) => (d ? d + " " : "") + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function leave() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) speechSynthesis.cancel();
    onDone({ type: "meeting", transcript });
  }

  return (
    <div className="stack">
      <div className="card goal">
        <strong>🎯 Your goal:</strong> {task.goal}
      </div>

      <section className="call">
        <div className="call-bar">
          <span className="live-dot" /> Live · {task.title}
          <button className={`chip chip-small ${voiceOn ? "selected" : ""}`} onClick={() => setVoiceOn((v) => !v)}>
            {voiceOn ? "🔊 Voices on" : "🔈 Voices off"}
          </button>
        </div>
        <div className="tiles">
          {task.personas.map((p) => (
            <div key={p.name} className={`tile ${speaking === p.name ? "speaking" : ""}`}>
              <span className="avatar">{initials(p.name)}</span>
              <strong>{p.name}</strong>
              <small>{p.role}</small>
            </div>
          ))}
          <div className={`tile tile-you ${listening ? "speaking" : ""}`}>
            <span className="avatar">You</span>
            <strong>You</strong>
            <small>{playerRole}</small>
          </div>
        </div>

        <div className="log" ref={logRef} aria-live="polite">
          {transcript.map((line, i) => (
            <div key={i} className={`bubble ${line.speaker === "You" ? "mine" : ""}`}>
              <small>{line.speaker}</small>
              <p>{line.text}</p>
            </div>
          ))}
          {loading && (
            <div className="bubble typing">
              <span /><span /><span />
            </div>
          )}
          {error && (
            <div className="error">
              {error}{" "}
              <button className="link" onClick={() => advance(transcript)}>Retry</button>
            </div>
          )}
        </div>

        {over ? (
          <div className="call-footer">
            <span className="muted">The meeting has ended.</span>
            <button className="btn btn-primary" onClick={leave}>Leave meeting →</button>
          </div>
        ) : (
          <div className="composer">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={loading ? "Listening to your coworkers..." : "Say something to the room... (Enter to send)"}
              rows={2}
              disabled={loading}
            />
            <div className="composer-actions">
              {micSupported && (
                <button
                  className={`btn btn-icon ${listening ? "recording" : ""}`}
                  onClick={toggleMic}
                  aria-label={listening ? "Stop dictation" : "Speak instead of typing"}
                  disabled={loading}
                >
                  {listening ? "⏹" : "🎙"}
                </button>
              )}
              <button className="btn btn-primary" onClick={send} disabled={loading || !draft.trim()}>
                Send
              </button>
            </div>
            <div className="composer-meta">
              <span className="muted">{turnsLeft} {turnsLeft === 1 ? "turn" : "turns"} left</span>
              {turnsUsed > 0 && (
                <button className="link" onClick={leave}>End meeting early</button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// --- Writing -----------------------------------------------------------------

export function WritingView({ task, onDone }: { task: WritingTask; onDone: OnDone }) {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="stack">
      <div className="card">
        <strong>What you know right now:</strong>
        <ul className="facts">
          {task.facts.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <div className="card">
        <p><strong>Your assignment:</strong> {task.prompt}</p>
        <textarea
          className="big-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={task.placeholder}
          rows={10}
        />
        <div className="actions">
          <span className="muted">{words} words</span>
          <button className="btn btn-primary" disabled={words < 15} onClick={() => onDone({ type: "writing", text })}>
            Send it →
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Decision ----------------------------------------------------------------

export function DecisionView({ task, onDone }: { task: DecisionTask; onDone: OnDone }) {
  const [choice, setChoice] = useState("");
  const [reasoning, setReasoning] = useState("");

  return (
    <div className="stack">
      <div className="card alert">
        <small>💬 New message from {task.message.from}</small>
        <p>{task.message.text}</p>
      </div>
      <div className="card">
        <p><strong>What do you tell {task.message.from.split(" ")[0]}?</strong></p>
        <div className="option-list" role="radiogroup">
          {task.options.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={choice === o.id}
              className={`option ${choice === o.id ? "selected" : ""}`}
              onClick={() => setChoice(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="field-label" htmlFor="reasoning">Why? (one or two sentences)</label>
        <textarea
          id="reasoning"
          className="big-input"
          rows={3}
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Because..."
        />
        <div className="actions">
          <span />
          <button className="btn btn-primary" disabled={!choice} onClick={() => onDone({ type: "decision", choice, reasoning })}>
            Make the call →
          </button>
        </div>
      </div>
    </div>
  );
}
