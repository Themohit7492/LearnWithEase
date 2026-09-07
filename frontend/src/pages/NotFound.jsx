import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="not-found">
      <div className="eyebrow">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link className="btn" to="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );
}
