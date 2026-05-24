export default function EmailForm({
  subject,
  body,
  loading,
  onSubjectChange,
  onBodyChange,
  onSubmit
}) {
  return (
    <form className="email-form" onSubmit={onSubmit}>
      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        name="subject"
        value={subject}
        onChange={(event) => onSubjectChange(event.target.value)}
      />

      <label htmlFor="body">Body</label>
      <textarea
        id="body"
        name="body"
        rows="12"
        value={body}
        onChange={(event) => onBodyChange(event.target.value)}
      />

      <button type="submit" disabled={loading || (!subject.trim() && !body.trim())}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
