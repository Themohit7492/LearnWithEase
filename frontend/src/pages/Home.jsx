import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Structured learning for every stage</div>
            <h1>
              Learn Smart.
              <br />
              Learn Easy.
            </h1>
            <p>
              Your personalized learning platform for school, college, and
              higher education.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/start-learning">
                Start Learning
              </Link>
              <Link className="btn btn-ghost" to="/start-learning">
                Explore Subjects
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="mini-stat">
              <strong>01</strong>
              <span>Choose your path</span>
            </div>
            <div className="mini-stat">
              <strong>02</strong>
              <span>Study structured chapters</span>
            </div>
            <div className="mini-stat">
              <strong>03</strong>
              <span>Track real progress</span>
            </div>
          </div>
        </section>
        <section id="about" className="section">
          <div className="section-heading">
            <div className="eyebrow">Why LearnWithEase</div>
            <h2>A focused learning system, not a noisy content feed.</h2>
          </div>
          <div className="feature-grid">
            {[
              [
                "Personalized Learning",
                "Choose your education level and course to find relevant subjects.",
              ],
              [
                "Structured Courses",
                "Learn through clearly organized subjects and chapters.",
              ],
              [
                "Track Your Progress",
                "Monitor completed chapters and subject progress.",
              ],
              [
                "Learn At Your Own Pace",
                "Continue from the exact point where you stopped.",
              ],
            ].map(([a, b], i) => (
              <article className="card" key={a}>
                <span className="feature-number">0{i + 1}</span>
                <h3>{a}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer>© 2026 LearnWithEase · Learn Smart. Learn Easy.</footer>
    </>
  );
}
