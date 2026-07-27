import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Progress } from "../../components/ui";
import { questions } from "../../data/questions";

export default function Assessment() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();
  const current = questions[currentIndex];
  const isAnswered = answers[current.id] !== undefined && answers[current.id]?.length !== 0;

  const selectAnswer = (value) => {
    if (current.type === "radio") setAnswers((previous) => ({ ...previous, [current.id]: value }));
    else {
      const existing = answers[current.id] || [];
      const next = existing.includes(value) ? existing.filter((item) => item !== value) : [...existing, value];
      setAnswers((previous) => ({ ...previous, [current.id]: next }));
    }
    setShowValidation(false);
  };

  const next = () => {
    if (!isAnswered) return setShowValidation(true);
    if (currentIndex === questions.length - 1) return setCompleted(true);
    setCurrentIndex((index) => index + 1);
  };

  if (!started) return (
    <div className="page-shell design-page assessment-stage">
      <section className="compact-card assessment-intro">
        <div>
          <div className="intro-icon">🌿</div>
          <span className="design-kicker">Wellness check-in</span>
          <h2 className="page-title" style={{ fontSize: "1.8rem", marginTop: "0.5rem" }}>Take a step towards a better you.</h2>
          <p className="page-subtitle">Answer a few thoughtful questions to understand your wellbeing and receive personal recommendations.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}><Button onClick={() => setStarted(true)}>Start assessment</Button></div>
          <p style={{ color: "#8b83a1", fontSize: "0.76rem" }}>About 2 minutes · Your answers stay private</p>
        </div>
      </section>
    </div>
  );

  if (completed) return (
    <div className="page-shell design-page assessment-stage">
      <section className="compact-card assessment-complete">
        <div>
          <div className="completion-ring"><span>✓</span></div>
          <span className="design-kicker">Check-in complete</span>
          <h2 className="page-title" style={{ fontSize: "1.8rem", marginTop: "0.5rem" }}>You’re doing great!</h2>
          <p className="page-subtitle">Your responses are ready. Explore your wellbeing summary and practical next steps.</p>
          <div className="btn-row" style={{ justifyContent: "center" }}><Button onClick={() => navigate("/results")}>View results</Button></div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="page-shell design-page assessment-stage">
      <section className="compact-card assessment-question-card">
        <div className="assessment-topline"><span>Wellness check-in</span><span>{currentIndex + 1} / {questions.length}</span></div>
        <Progress value={currentIndex + 1} max={questions.length} />
        <div style={{ margin: "1.35rem 0 0.9rem" }}><span style={{ fontSize: "1.6rem" }}>{current.emoji}</span><h2 style={{ color: "#352b55", fontSize: "1.25rem", margin: "0.55rem 0" }}>{current.prompt}</h2><p style={{ color: "#817899", fontSize: "0.82rem", margin: 0 }}>Choose the response that feels most true today.</p></div>
        <div className="option-list">
          {current.options.map((option) => {
            const active = current.type === "radio" ? answers[current.id] === option.value : (answers[current.id] || []).includes(option.value);
            return <button key={option.value} type="button" className={`option-item answer-option ${active ? "active" : ""}`} aria-pressed={active} onClick={() => selectAnswer(option.value)}><span className={`answer-control ${current.type === "checkbox" ? "checkbox" : ""}`}>{active ? "✓" : ""}</span><span>{option.icon} {option.label}</span></button>;
          })}
        </div>
        {showValidation && <Alert variant="warning" style={{ marginTop: "1rem" }}>Please choose an answer before continuing.</Alert>}
        <div className="btn-row" style={{ justifyContent: "space-between" }}><Button variant="secondary" disabled={currentIndex === 0} onClick={() => { setCurrentIndex((index) => index - 1); setShowValidation(false); }}>Previous</Button><Button onClick={next}>{currentIndex === questions.length - 1 ? "Finish" : "Next"}</Button></div>
      </section>
    </div>
  );
}
