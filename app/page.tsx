import Link from "next/link";
import { CAREERS } from "@/lib/careers";

const FLOATERS = ["📋", "🩺", "💻", "🎨", "📣", "☕", "📅", "💬"];

const STEPS = [
  { emoji: "🎯", title: "Pick a career", text: "Choose a job you're curious about, from project manager to nurse." },
  { emoji: "🎬", title: "Live the day", text: "Answer emails, join meetings with AI coworkers, and handle surprises." },
  { emoji: "📊", title: "Get your report", text: "See your strengths, your skill scores, and whether the job fits you." },
];

export default function Home() {
  const liveCount = CAREERS.filter((c) => c.available).length;

  return (
    <main className="home">
      <section className="hero-band">
        <div className="floaters" aria-hidden="true">
          {FLOATERS.map((e, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>{e}</span>
          ))}
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="badge">✨ {liveCount} careers to try, more coming</span>
            <h1>
              Try a career <span className="underline">before</span> you choose it.
            </h1>
            <p>
              Live a real workday in minutes: a packed inbox, live meetings with AI coworkers,
              curveballs, and an honest report on how you did.
            </p>
            <div className="hero-actions">
              <a href="#careers" className="btn-hero">Start your first day →</a>
              <span className="hero-note">No sign-up · About 25 minutes</span>
            </div>
          </div>

          <div className="preview" aria-hidden="true">
            <div className="preview-bar">
              <span className="live-dot" /> Live · Client call
            </div>
            <div className="preview-msg">
              <span className="preview-avatar" style={{ background: "#b45309" }}>LP</span>
              <p><strong>Linda Park</strong>We need text reminders added before launch. Same date.</p>
            </div>
            <div className="preview-msg mine">
              <p><strong>You</strong>I hear you. Let me walk you through two options that protect the launch…</p>
            </div>
            <div className="preview-msg">
              <span className="preview-avatar" style={{ background: "#b45309" }}>LP</span>
              <p><strong>Linda Park</strong>Okay. I&apos;m listening.</p>
            </div>
            <div className="preview-score">
              <span>📈 Stakeholder management</span>
              <strong>8/10</strong>
            </div>
          </div>
        </div>

        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      <section className="steps container-wide">
        {STEPS.map((s, i) => (
          <div key={s.title} className="step">
            <span className="step-num">{i + 1}</span>
            <span className="step-emoji">{s.emoji}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </section>

      <section id="careers" className="container-wide">
        <h2 className="section-title">Pick your day</h2>
        <div className="career-grid">
          {CAREERS.map((c) => {
            const style = { "--c1": c.colors[0], "--c2": c.colors[1] } as React.CSSProperties;
            const body = (
              <>
                <div className="career-top">
                  <span className="career-emoji">{c.emoji}</span>
                </div>
                <div className="career-body">
                  <h3>{c.title}</h3>
                  <p>{c.tagline}</p>
                  {c.available ? (
                    <div className="career-foot">
                      <span className="career-meta">{c.tasks.length} tasks · ~25 min</span>
                      <span className="career-go">Play →</span>
                    </div>
                  ) : (
                    <div className="career-foot">
                      <span className="career-meta">Coming soon</span>
                    </div>
                  )}
                </div>
              </>
            );
            return c.available ? (
              <Link key={c.id} href={`/sim/${c.id}`} className="career-card" style={style}>
                {body}
              </Link>
            ) : (
              <div key={c.id} className="career-card soon" style={style}>
                {body}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="home-footer">
        <strong>Day One</strong> · Find the job that fits before you commit to it.
      </footer>
    </main>
  );
}
