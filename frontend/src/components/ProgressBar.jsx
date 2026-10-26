export default function ProgressBar({ value, label }) {
  return (
    <div>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{value} %</strong>
        </div>
      )}
      <div className="progress"><div style={{ width: `${value}%` }} /></div>
    </div>
  );
}
