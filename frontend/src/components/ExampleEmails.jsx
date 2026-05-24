const examples = [
  {
    label: "Phishing example 1",
    subject: "Urgent: verify your account",
    body: "Your mailbox will be suspended today. Visit http://security-check.example/login and confirm your password immediately."
  },
  {
    label: "Phishing example 2",
    subject: "Invoice payment required",
    body: "We detected a failed payment. Open the attached invoice portal and update your banking information to avoid penalties."
  },
  {
    label: "Legitimate example 1",
    subject: "Project meeting notes",
    body: "Hi team, attached are the notes from today's meeting. Please review the timeline before Friday's planning call."
  },
  {
    label: "Legitimate example 2",
    subject: "Library account reminder",
    body: "This is a reminder that your borrowed book is due next week. You can renew it from your library account."
  }
];

export default function ExampleEmails({ onSelect }) {
  return (
    <nav className="examples" aria-label="Example emails">
      {examples.map((example) => (
        <button key={example.label} type="button" onClick={() => onSelect(example)}>
          {example.label}
        </button>
      ))}
    </nav>
  );
}
