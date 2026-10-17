import Link from "next/link";
import { ArrowRight, ChartColumn, ChevronRight, Clock, Target, TrendingUp, Video } from "lucide-react";
import { CAREERS } from "@/lib/careers";
import CareerIcon from "@/components/CareerIcon";
import Logo from "@/components/Logo";

const STEPS = [
  { icon: Target, tint: "var(--lavender)", title: "Pick a career", text: "Choose a job you're curious about." },
  { icon: Video, tint: "var(--peach)", title: "Live the day", text: "Emails, meetings with AI coworkers, and a few surprises." },
  { icon: ChartColumn, tint: "var(--sage)", title: "Get your report", text: "See your strengths and whether the job fits you." },
];

export default function Home() {
  const live = CAREERS.filter((c) => c.available);
  const soon = CAREERS.filter((c) => !c.available);

  return (
    <main className="home">
      <nav className="home-nav">
        <Link href="/" aria-label="Day One home"><Logo /></Link>
        <a href="#careers" className="nav-link">Careers</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <h1>
            Try a career <span className="soft-mark">before</span> you choose it.
          </h1>
          <p>
            Spend a calm, realistic workday in someone else&apos;s shoes. Answer emails, join
            meetings with AI coworkers, and get honest, friendly feedback.
          </p>
          <div className="hero-actions">
            <a href="#careers" className="btn btn-primary btn-lg">
              Start your first day <ArrowRight size={18} aria-hidden="true" />
            </a>
            <span className="hero-note">
              <Clock size={15} aria-hidden="true" /> About 25 minutes · No sign-up
            </span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <span className="blob blob-peach" />
          <span className="blob blob-sage" />
          <span className="blob blob-lavender" />
          <div className="preview">
            <div className="preview-bar">
              <span className="live-dot" /> Client call
            </div>
            <div className="preview-msg">
              <span className="preview-avatar">LP</span>
              <p><strong>Linda Park</strong>We need text reminders before launch. Same date.</p>
            </div>
            <div className="preview-msg mine">
              <p><strong>You</strong>I hear you. Let me walk you through two options…</p>
            </div>
            <div className="preview-score">
              <span><TrendingUp size={16} /> Stakeholder management</span>
              <strong>8/10</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="steps">
        {STEPS.map((s, i) => (
          <div key={s.title} className="step">
            <span className="step-icon" style={{ background: s.tint }}>
              <s.icon size={22} aria-hidden="true" />
            </span>
            <div>
              <h3><span className="step-num">{i + 1}.</span> {s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="careers" className="careers">
        <h2>Pick your day</h2>
        <div className="career-list">
          {live.map((c) => (
            <Link
              key={c.id}
              href={`/sim/${c.id}`}
              className="career-card"
              style={{ "--c": c.color } as React.CSSProperties}
            >
              <span className="career-icon"><CareerIcon careerId={c.id} size={26} /></span>
              <span className="career-text">
                <strong>{c.title}</strong>
                <span>{c.tagline}</span>
                <small>{c.tasks.length} tasks · about 25 min</small>
              </span>
              <span className="career-go">
                <span className="career-go-label">Start</span>
                <ChevronRight size={20} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        {soon.length > 0 && (
          <div className="soon">
            <span className="soon-label">Coming soon</span>
            <div className="soon-list">
              {soon.map((c) => (
                <span key={c.id} className="soon-chip" style={{ "--c": c.color } as React.CSSProperties}>
                  <CareerIcon careerId={c.id} size={16} /> {c.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="home-footer">
        <Logo />
        <p>Find the job that fits before you commit to it.</p>
      </footer>
    </main>
  );
}
