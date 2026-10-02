import Link from "next/link";
import { CAREERS } from "@/lib/careers";

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">Day One</p>
        <h1>Try a career before you choose it.</h1>
        <p className="lede">
          Pick a job and live a full simulated workday: an inbox, live meetings with AI coworkers,
          real decisions, and an honest end-of-day report on how you did.
        </p>
      </header>

      <section className="career-grid">
        {CAREERS.map((c) =>
          c.available ? (
            <Link key={c.id} href={`/sim/${c.id}`} className="career-card">
              <span className="career-emoji">{c.emoji}</span>
              <h2>{c.title}</h2>
              <p>{c.tagline}</p>
              <span className="pill pill-accent">Start your day →</span>
            </Link>
          ) : (
            <div key={c.id} className="career-card disabled">
              <span className="career-emoji">{c.emoji}</span>
              <h2>{c.title}</h2>
              <p>{c.tagline}</p>
              <span className="pill">Coming soon</span>
            </div>
          ),
        )}
      </section>
    </main>
  );
}
