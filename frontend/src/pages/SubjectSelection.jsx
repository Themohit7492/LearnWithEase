import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { get } from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
import SubjectCard from "../components/SubjectCard.jsx";
export default function SubjectSelection() {
  const [params] = useSearchParams();
  const [subjects, setSubjects] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const q = new URLSearchParams();
    if (params.get("education")) q.set("education", params.get("education"));
    if (params.get("course")) q.set("course", params.get("course"));
    get(`/subjects?${q}`).then(setSubjects);
  }, [params.toString()]);
  const filtered = useMemo(
    () =>
      subjects?.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ) || [],
    [subjects, search],
  );
  return (
    <AppShell>
      <div className="page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">Step 3</div>
            <h1>Select a subject</h1>
            <p>Choose a subject to review its chapters and start learning.</p>
          </div>
          <input
            className="search"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!subjects ? (
          <Loader label="Loading subjects..." />
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>No subjects found</h3>
            <p>Try another search or learning path.</p>
          </div>
        ) : (
          <div className="subject-grid">
            {filtered.map((s) => (
              <SubjectCard key={s._id} subject={s} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
