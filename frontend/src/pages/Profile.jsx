import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { get } from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState(null);
  useEffect(() => {
    Promise.all([get("/progress"), get("/enrollments")]).then(([a, b]) => {
      setStats(a);
      setEnrollments(b);
    });
  }, []);
  if (!stats)
    return (
      <AppShell>
        <Loader label="Loading profile..." />
      </AppShell>
    );
  return (
    <AppShell>
      <div className="page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">Learning profile</div>
            <h1>Profile</h1>
          </div>
        </div>
        <section className="profile-grid">
          <article className="card profile-card">
            <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <dl>
              <div>
                <dt>Education</dt>
                <dd>{user.education?.name || "Not selected"}</dd>
              </div>
              <div>
                <dt>Course</dt>
                <dd>
                  {user.course?.shortName ||
                    user.course?.name ||
                    "Not applicable"}
                </dd>
              </div>
              <div>
                <dt>Member Since</dt>
                <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </article>
          <div>
            <h2>Learning Statistics</h2>
            <div className="stats-grid compact">
              {[
                [stats.enrolledSubjects, "Subjects Enrolled"],
                [stats.completedChapters, "Chapters Completed"],
                [stats.completedSubjects, "Subjects Completed"],
                [`${stats.overallProgress}%`, "Overall Progress"],
              ].map(([v, l]) => (
                <div className="stat-card" key={l}>
                  <strong>{v}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section-block" id="progress">
          <div className="section-title">
            <h2>My Learning Progress</h2>
          </div>
          {enrollments?.length ? (
            <div className="progress-list">
              {enrollments.map((e) => (
                <article className="card progress-card" key={e._id}>
                  <div>
                    <div className="eyebrow">
                      {e.subject.course?.shortName || e.subject.education?.name}
                    </div>
                    <h3>{e.subject.name}</h3>
                    <p>
                      {e.completedCount} / {e.totalChapters} chapters
                    </p>
                  </div>
                  <div className="progress-side">
                    <ProgressBar value={e.progress} />
                    <Link to={`/subject/${e.subject._id}`}>Continue →</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No learning progress yet</h3>
              <Link className="btn" to="/start-learning">
                Start Learning
              </Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
