import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get, patch } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
export default function EducationSelection() {
  const { educationId } = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  const { updateLearning } = useAuth();
  const [education, setEducation] = useState(loc.state?.education || null);
  const [courses, setCourses] = useState(null);
  useEffect(() => {
    (async () => {
      const ed = education || (await get(`/education/${educationId}`));
      setEducation(ed);
      if (ed.requiresCourse)
        setCourses(await get(`/courses/education/${educationId}`));
      else {
        await updateLearning({ educationId });
        nav(`/subjects?education=${educationId}`, { replace: true });
      }
    })();
  }, []);
  if (!education || (education.requiresCourse && courses === null))
    return (
      <AppShell>
        <Loader label="Preparing your learning path..." />
      </AppShell>
    );
  return (
    <AppShell>
      <div className="page narrow">
        <button className="back-link" onClick={() => nav("/start-learning")}>
          ← Back
        </button>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Step 2 · {education.name}</div>
            <h1>Select your course or branch</h1>
            <p>Choose the path that matches your program.</p>
          </div>
        </div>
        <div className="selection-grid">
          {courses.map((c) => (
            <button
              className="selection-card"
              key={c._id}
              onClick={async () => {
                await patch("/auth/profile/learning", {
                  educationId,
                  courseId: c._id,
                });
                nav(`/subjects?education=${educationId}&course=${c._id}`);
              }}
            >
              <strong>{c.shortName || c.name}</strong>
              <span>{c.name}</span>
              <small>View subjects →</small>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
