import { useState } from "react";
import { Alert, Badge, Button, Input } from "../../components/ui";
import { getUpcomingWorkshops } from "../../data/workshopData";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

export default function Workshops() {
  const workshops = getUpcomingWorkshops();
  const [selectedId, setSelectedId] = useState(workshops[0]?.id);
  const [registered, setRegistered] = useState(false);
  const selected = workshops.find((workshop) => workshop.id === selectedId) || workshops[0];

  return <div className="page-shell design-page">
    <div className="design-heading"><div><span className="design-kicker">Workshops</span><h2 className="page-title" style={{ fontSize: "1.55rem", marginTop: "0.2rem" }}>Learn and grow together.</h2></div><Badge variant="primary">Live sessions</Badge></div>
    <section className="workshop-workspace">
      <div className="compact-card"><h3 style={{ margin: 0, color: "#3d3459", fontSize: "1rem" }}>Workshop list</h3><Input className="compact-search" placeholder="Search workshops..." style={{ marginTop: "0.8rem" }} />
        <div className="workshop-list">{workshops.map((workshop) => <button type="button" className={`workshop-list-item ${selected?.id === workshop.id ? "active" : ""}`} key={workshop.id} onClick={() => { setSelectedId(workshop.id); setRegistered(false); }}><strong>{workshop.emoji} {workshop.title}</strong><small>{workshop.date} · {workshop.time}</small><small>{workshop.attendees}/{workshop.maxAttendees} spaces reserved</small></button>)}</div>
      </div>
      <div className="compact-card">{selected && <><div className="workshop-cover">{selected.emoji}</div><div style={{ marginTop: "0.85rem" }}><Badge variant="info">{selected.category}</Badge><h3 style={{ margin: "0.55rem 0 0.25rem", color: "#3d3459" }}>{selected.title}</h3><p style={{ color: "#756d90", fontSize: "0.82rem", lineHeight: 1.65 }}>{selected.description}</p></div><div className="detail-lines"><div className="detail-line"><span>Date</span><strong>{selected.date}</strong></div><div className="detail-line"><span>Time</span><strong>{selected.time} · {selected.duration}</strong></div><div className="detail-line"><span>Instructor</span><strong>{selected.instructor}</strong></div><div className="detail-line"><span>Availability</span><strong>{selected.maxAttendees - selected.attendees} seats left</strong></div></div>{registered ? <Alert variant="success">You’re registered! Workshop details will appear in your dashboard.</Alert> : <Button style={{ width: "100%" }} onClick={() => setRegistered(true)}>Register now</Button>}</>}
      </div>
      <div className="compact-card"><div className="calendar-header"><span>‹</span><span>August 2026</span><span>›</span></div><div className="calendar-labels">{days.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="calendar-days">{calendarDays.map((day) => <span key={day} className={[5, 7, 9, 10, 12, 14].includes(day) ? "event-day" : ""}>{day}</span>)}</div><div style={{ borderTop: "1px solid #eeeaf7", marginTop: "1rem", paddingTop: "0.8rem" }}><span className="design-kicker">Upcoming</span>{workshops.slice(0, 2).map((workshop) => <p key={workshop.id} style={{ color: "#5f5579", fontSize: "0.75rem", margin: "0.45rem 0" }}><strong>{workshop.date.slice(-2)} Aug</strong> · {workshop.title}</p>)}</div></div>
    </section>
  </div>;
}
