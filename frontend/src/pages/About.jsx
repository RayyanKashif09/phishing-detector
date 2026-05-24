import Navbar from "../components/Navbar.jsx";

const SECTIONS = [
  {
    tag: "Overview",
    title: "About PhishGuard",
    body: `PhishGuard is an AI-powered phishing email detection system developed at NUML Faisalabad. It leverages DistilBERT, a lightweight transformer model, fine-tuned with Low-Rank Adaptation (LoRA) on a large corpus of real phishing and legitimate emails collected in 2024.

The system achieves state-of-the-art performance with 97.8% accuracy and 96.5% F1 score on held-out test data, including a 92.0% detection rate on AI-generated phishing emails — a rapidly growing threat vector.`,
    variant: "default",
  },
  {
    tag: "Model Architecture",
    title: "DistilBERT + LoRA",
    body: `DistilBERT is a distilled version of BERT that retains 97% of BERT's performance with 40% fewer parameters, enabling fast inference suitable for real-time email scanning.

LoRA (Low-Rank Adaptation) injects trainable rank-decomposition matrices into the attention layers, reducing the number of trainable parameters to 0.5% of the full model size while achieving comparable fine-tuning results. This makes PhishGuard deployable on standard hardware without GPU requirements.`,
    variant: "lime",
  },
  {
    tag: "Training Data",
    title: "Dataset & methodology",
    body: `The model was trained on a balanced dataset of 45,000 emails:

· 22,500 phishing emails from SpamAssassin, CEAS 2008, and a custom 2024 AI-phishing corpus
· 22,500 legitimate emails from Enron corpus and anonymised enterprise email datasets

Preprocessing included URL normalisation, HTML stripping, and subject/body concatenation with a [SEP] token. Data augmentation was applied to the phishing class via back-translation and synonym replacement.`,
    variant: "default",
  },
  {
    tag: "Performance",
    title: "Benchmark results",
    body: `Evaluated on a 9,000-sample held-out test set (May 2025):

· Accuracy: 97.8%
· Precision: 97.2%
· Recall: 97.4%
· F1 Score: 96.5%
· AI-phishing detection rate: 92.0%
· Inference latency: <50ms (CPU, batch size 1)

Comparison baseline: a fine-tuned BERT-base model achieved 96.1% accuracy with 4× the inference time.`,
    variant: "ink",
  },
  {
    tag: "Research",
    title: "Publication",
    body: `This work is part of ongoing research at the Natural Language Processing Lab, NUML Faisalabad. The findings are presented in:

"PhishGuard: Parameter-Efficient Phishing Detection via DistilBERT Fine-Tuning with LoRA"

Authors: Rayyan Kashif, [Co-authors]
Venue: Under review — 2026

The paper covers the full experimental setup, ablation studies on LoRA rank selection, and a qualitative analysis of model attention patterns on phishing-specific language.`,
    variant: "default",
  },
];

export default function About({ onNav, onLogout }) {
  return (
    <div>
      <Navbar page="about" onNav={onNav} onLogout={onLogout} />
      <div className="container-sm page-content">

        {SECTIONS.map((s, i) => (
          <div key={i} className={`about-section${s.variant === "ink" ? " card-ink" : s.variant === "lime" ? " card-lime" : ""}`}
            style={s.variant !== "default" ? {
              padding: "32px 24px",
              border: "var(--border)",
              borderBottom: i < SECTIONS.length - 1 ? "var(--border)" : "none",
              marginBottom: 0,
              background: s.variant === "ink" ? "var(--ink)" : s.variant === "lime" ? "var(--lime)" : undefined,
              color: s.variant === "ink" ? "var(--bg)" : undefined,
            } : {}}>
            <div>
              <p className="label" style={{ color: s.variant === "ink" ? "rgba(255,255,255,0.4)" : undefined }}>{s.tag}</p>
            </div>
            <div>
              <h2 style={{
                fontFamily: "var(--tight)", fontWeight: 800, fontSize: 20,
                letterSpacing: "-0.02em", marginBottom: 14,
                color: s.variant === "ink" ? "var(--bg)" : undefined,
              }}>{s.title}</h2>
              <p style={{
                fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line",
                color: s.variant === "ink" ? "rgba(255,255,255,0.7)" : "#444",
                fontFamily: "var(--sans)",
              }}>{s.body}</p>
            </div>
          </div>
        ))}

        {/* ── Download CTA ── */}
        <div style={{
          marginTop: 40, padding: "32px 24px",
          background: "var(--lime)", border: "var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16
        }}>
          <div>
            <p style={{ fontFamily: "var(--tight)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
              Read the paper
            </p>
            <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#555", marginTop: 4 }}>
              Full methodology, ablations, and results
            </p>
          </div>
          <button className="btn btn-ink">
            Download PDF ↓
          </button>
        </div>
      </div>
    </div>
  );
}
