import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../services/api.js";
import AppShell from "../components/AppShell.jsx";
import Loader from "../components/Loader.jsx";
export default function StartLearning() {
  const [items, setItems] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    get("/education").then(setItems);
  }, []);
  if (!items)
    return (
      <AppShell>
        <Loader label="Loading education paths..." />
      </AppShell>
    );
  return (
    <AppShell>
      <div className="page narrow">
        <div className="page-heading">
          <div>
            <div className="eyebrow">Step 1</div>
            <h1>What do you want to learn?</h1>
            <p>Select your current education level.</p>
          </div>
        </div>
        <div className="selection-grid">
          {items.map((e) => (
            <button
              className="selection-card"
              key={e._id}
              onClick={() =>
                nav(`/education/${e._id}`, { state: { education: e } })
              }
            >
              <strong>{e.name}</strong>
              <span>{e.description}</span>
              <small>
                {e.requiresCourse
                  ? "Choose a course next"
                  : "Go directly to subjects"}{" "}
                →
              </small>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
