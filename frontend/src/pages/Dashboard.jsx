import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { get } from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  useEffect(() => {
    Promise.all([get("/progress"), get("/enrollments")])
      .then(([a, b]) => {
        setData(a);
        setEnrollments(b);
      })
      .catch(() => {});
  }, []);
  if (!data)
    return (
      <AppShell>
        <Loader label="Loading your dashboard..." />
      </AppShell>
    );
  const recent = enrollments[0];
  return (
    <AppShell>
      <div className="page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">Student dashboard</div>
            <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p>Continue your learning journey.</p>
          </div>
          <Link className="btn" to="/start-learning">
            Start Learning
          </Link>
        </div>
        <section className="stats-grid">
          {[
            [data.enrolledSubjects, "Enrolled Subjects"],
            [data.completedChapters, "Completed Chapters"],
            [`${data.overallProgress}%`, "Overall Progress"],
            [data.completedSubjects, "Completed Subjects"],
          ].map(([v, l]) => (
            <div className="stat-card" key={l}>
              <strong>{v}</strong>
              <span>{l}</span>
            </div>
          ))}
        </section>
        {recent && (
          <section className="section-block">
            <div className="section-title">
              <h2>Continue Learning</h2>
            </div>
            <article className="continue-card">
              <div>
                <div className="eyebrow">Recently accessed</div>
                <h3>{recent.subject.name}</h3>
                <p>
                  {recent.lastAccessedChapter
                    ? `Chapter ${recent.lastAccessedChapter.chapterNumber} — ${recent.lastAccessedChapter.title}`
                    : "Ready to begin"}
                </p>
                <ProgressBar value={recent.progress} />
              </div>
              <Link
                className="btn"
                to={
                  recent.lastAccessedChapter
                    ? `/subject/${recent.subject._id}/chapter/${recent.lastAccessedChapter._id}`
                    : `/subject/${recent.subject._id}`
                }
              >
                Continue
              </Link>
            </article>
          </section>
        )}
        <section className="section-block" id="subjects">
          <div className="section-title">
            <h2>My Enrolled Subjects</h2>
            <Link to="/start-learning">Explore more →</Link>
          </div>
          {enrollments.length === 0 ? (
            <div className="empty">
              <h3>You haven't enrolled in any subjects yet.</h3>
              <p>Start exploring courses and begin learning.</p>
              <Link className="btn" to="/start-learning">
                Start Learning
              </Link>
            </div>
          ) : (
            <div className="enrollment-grid">
              {enrollments.map((e) => (
                <article className="card" key={e._id}>
                  <div className="eyebrow">
                    {e.subject.education?.name}
                    {e.subject.course
                      ? ` • ${e.subject.course.shortName || e.subject.course.name}`
                      : ""}
                  </div>
                  <h3>{e.subject.name}</h3>
                  <p>
                    {e.completedCount} / {e.totalChapters} chapters completed
                  </p>
                  <ProgressBar value={e.progress} />
                  <Link
                    className="btn btn-block"
                    to={`/subject/${e.subject._id}`}
                  >
                    Continue Learning →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
