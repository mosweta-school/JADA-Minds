import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Progress } from "../../components/ui";

const dimensions = [{ label: "Stress", value: 66 }, { label: "Sleep", value: 74 }, { label: "Mood", value: 76 }, { label: "Energy", value: 64 }];
const recommendations = [
  ["🫁", "Practice deep breathing", "Take a slow five-minute pause when stress builds."],
  ["📖", "Improve sleep", "Create a screen-free wind-down ritual tonight."],
  ["🚶", "Stay active", "Enjoy a 20-minute walk or gentle movement."],
];

function TrendChart() {
  return <div className="chart-wrap" aria-label="Wellness trend chart"><svg viewBox="0 0 320 190" role="img"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#29bd9a"/><stop offset="1" stopColor="#fff"/></linearGradient></defs>{[30, 70, 110, 150].map((y) => <line key={y} className="chart-grid" x1="0" x2="320" y1={y} y2={y} />)}<path className="chart-area" d="M8 145 L48 132 L86 138 L124 98 L162 111 L200 60 L238 79 L276 36 L312 47 L312 180 L8 180 Z"/><path className="chart-line" d="M8 145 L48 132 L86 138 L124 98 L162 111 L200 60 L238 79 L276 36 L312 47"/>{[[8,145],[48,132],[86,138],[124,98],[162,111],[200,60],[238,79],[276,36],[312,47]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="3.5" fill="#29bd9a" />)}</svg></div>;
}

export default function Results() {
  const navigate = useNavigate();
  return <div className="page-shell design-page">
    <div className="design-heading"><div><span className="design-kicker">Results & progress</span><h2 className="page-title" style={{ fontSize: "1.55rem", marginTop: "0.2rem" }}>Your wellness summary</h2></div><Badge variant="success">Assessment complete</Badge></div>
    <section className="results-layout">
      <Card className="score-panel"><span className="design-kicker">Your wellness score</span><div className="score-number">72<span style={{ fontSize: "1.25rem" }}>%</span></div><Badge variant="success">Complete</Badge><p style={{ color: "#786f90", fontSize: "0.8rem" }}>You are making progress. Keep it up!</p>{dimensions.map((item) => <div className="dimension-row" key={item.label}><span>{item.label}</span><Progress value={item.value} max={100} variant="success"/><strong>{item.value}%</strong></div>)}<div className="btn-row"><Button size="sm" style={{ width: "100%" }} onClick={() => navigate("/")}>Back to dashboard</Button></div></Card>
      <Card><span className="design-kicker">Recommendations</span><h3 style={{ margin: "0.35rem 0", color: "#3d3459" }}>Based on your results</h3><div className="recommendation-list">{recommendations.map(([icon, title, text]) => <div className="recommendation-item" key={title}><span>{icon}</span><div><strong>{title}</strong><br />{text}</div></div>)}</div><div className="btn-row"><Button variant="outline" size="sm" style={{ width: "100%" }} onClick={() => navigate("/resources")}>View all recommendations</Button></div></Card>
      <Card><div className="design-heading"><div><span className="design-kicker">Progress chart</span><h3 style={{ margin: "0.35rem 0", color: "#3d3459" }}>Wellness trend</h3></div><Badge variant="primary">This month</Badge></div><TrendChart /><div style={{ display: "flex", justifyContent: "space-between", color: "#938ba8", fontSize: "0.67rem" }}><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Today</span></div></Card>
    </section>
  </div>;
}
