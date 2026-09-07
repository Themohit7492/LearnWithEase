import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function SubjectDetails() {
  const { subjectId } = useParams();
  const nav = useNavigate();

  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await get(`/subjects/${subjectId}`);
      setS(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [subjectId]);

  if (error) {
    return (
      <AppShell>
        <div className="page">
          <div className="alert error">{error}</div>
        </div>
      </AppShell>
    );
  }

  if (!s) {
    return (
      <AppShell>
        <Loader label="Loading subject..." />
      </AppShell>
    );
  }

  const enroll = async () => {
    try {
      await post("/enrollments", { subjectId });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AppShell>
      <div className="page reading-width">
        <button className="back-link" onClick={() => nav(-1)}>
          ← Back
        </button>

        <div className="subject-hero">
          <div>
            <div className="eyebrow">
              {s.education.name}
              {s.course ? ` • ${s.course.shortName || s.course.name}` : ""}
            </div>

            <h1>{s.name}</h1>
            <p>{s.description}</p>
          </div>

          <div className="subject-summary">
            <strong>{s.chapters.length}</strong>
            <span>Total Chapters</span>

            <strong>{s.completedChapters}</strong>
            <span>Completed</span>
          </div>
        </div>

        <ProgressBar value={s.progress} />

        {!s.enrolled && (
          <button className="btn enroll-btn" onClick={enroll}>
            Enroll in Subject
          </button>
        )}

        <section className="section-block">
          <div className="section-title">
            <h2>Chapters</h2>
            <span>
              {s.completedChapters} / {s.chapters.length} complete
            </span>
          </div>

          <div className="chapter-list">
            {s.chapters.map((ch) => (
              <div className="chapter-row" key={ch._id}>
                <div className="chapter-number">
                  {String(ch.chapterNumber).padStart(2, "0")}
                </div>

                <div>
                  <h3>{ch.title}</h3>
                  <p>{ch.description}</p>
                </div>

                <span className={`status ${ch.completed ? "done" : ""}`}>
                  {ch.completed
                    ? "Completed ✓"
                    : s.enrolled
                      ? "Ready"
                      : "Locked"}
                </span>

                {s.enrolled ? (
                  <Link
                    className="btn btn-small"
                    to={`/subject/${s._id}/chapter/${ch._id}`}
                  >
                    Open
                  </Link>
                ) : (
                  <button className="btn btn-small" disabled>
                    Enroll first
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
