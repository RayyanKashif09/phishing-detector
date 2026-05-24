export default function ResultCard({ result }) {
  const label = result.label === "phishing" ? "PHISHING" : "LEGITIMATE";
  const confidence = Number(result.confidence || 0);
  const percent = Math.round(confidence * 1000) / 10;

  return (
    <section className="result-card" aria-live="polite">
      <p className={`result-label ${result.label}`}>{label}</p>
      <p>Confidence: {percent.toFixed(1)}%</p>
      <div className="progress" aria-label={`Confidence ${percent.toFixed(1)} percent`}>
        <div className="progress-fill" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </section>
  );
}
