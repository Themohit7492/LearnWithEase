export default function ProgressBar({ value = 0 }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className="progress-row" aria-label={`${safe}% complete`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safe}%` }} />
      </div>
      <span>{safe}%</span>
    </div>
  );
}
