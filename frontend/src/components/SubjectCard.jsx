import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar.jsx";
export default function SubjectCard({ subject }) {
  return (
    <article className="card subject-card">
      <div className="eyebrow">
        {subject.course?.shortName ||
          subject.course?.name ||
          subject.education?.name}
      </div>
      <h3>{subject.name}</h3>
      <p>{subject.description}</p>
      <div className="meta">
        <span>
          {subject.chapterCount ?? subject.totalChapters ?? 0} chapters
        </span>
        <span>{subject.enrolled ? "Enrolled" : "Available"}</span>
      </div>
      {subject.enrolled && <ProgressBar value={subject.progress} />}
      <Link className="btn btn-block" to={`/subject/${subject._id}`}>
        {subject.enrolled ? "Continue Learning" : "View Subject"}
      </Link>
    </article>
  );
}
