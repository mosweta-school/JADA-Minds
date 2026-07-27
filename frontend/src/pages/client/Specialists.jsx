import { useMemo, useState } from "react";
import { Alert, Button, Input } from "../../components/ui";
import { specialistProfiles } from "../../data/specialistProfiles";

export default function Specialists() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(specialistProfiles[0].id);
  const [booked, setBooked] = useState(false);
  const specialists = useMemo(() => specialistProfiles.filter((specialist) => (category === "All" || specialist.category === category) && `${specialist.name} ${specialist.focus}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const selected = specialists.find((specialist) => specialist.id === selectedId) || specialists[0];

  return <div className="page-shell design-page">
    <div className="design-heading"><div><span className="design-kicker">Specialists</span><h2 className="page-title" style={{ fontSize: "1.55rem", marginTop: "0.2rem" }}>Find support that fits you.</h2></div><span style={{ color: "#817897", fontSize: "0.8rem" }}>{specialists.length} available specialists</span></div>
    <section className="specialist-workspace">
      <div className="compact-card"><h3 style={{ margin: 0, color: "#3d3459", fontSize: "1rem" }}>Specialist list</h3><Input className="compact-search" placeholder="Search specialists..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ marginTop: "0.8rem" }} />
        <div className="specialist-list">{specialists.map((specialist) => <button className={`specialist-list-item ${specialist.id === selected?.id ? "active" : ""}`} type="button" key={specialist.id} onClick={() => { setSelectedId(specialist.id); setBooked(false); }}><span className="avatar">{specialist.emoji}</span><span><strong>{specialist.name}</strong><small>{specialist.title}</small><small>⭐ {specialist.rating} · {specialist.availability}</small></span></button>)}{!specialists.length && <Alert variant="info">No specialists match your search.</Alert>}</div>
      </div>
      <div className="compact-card"><h3 style={{ margin: 0, color: "#3d3459", fontSize: "1rem" }}>Search & filters</h3><div className="filter-stack"><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option><option>Mental Health</option><option>Coaching</option><option>Nutrition</option><option>Therapy</option></select></label><label>Availability<select defaultValue="Any time"><option>Any time</option><option>Today</option><option>This week</option><option>Next week</option></select></label><label>Rating<select defaultValue="4.5 stars & above"><option>4.5 stars & above</option><option>4 stars & above</option><option>Any rating</option></select></label></div><div className="btn-row"><Button variant="secondary" size="sm" onClick={() => { setQuery(""); setCategory("All"); }}>Reset</Button><Button size="sm" style={{ flex: 1 }}>Apply filters</Button></div></div>
      <div className="compact-card">{selected ? <><div className="profile-highlight"><span className="avatar">{selected.emoji}</span><h3 style={{ margin: 0, color: "#3d3459" }}>{selected.name}</h3><p>{selected.title}</p><p>⭐ {selected.rating} ({selected.reviews} reviews) · <span style={{ color: "#22a77d" }}>Online</span></p></div><p style={{ color: "#6f6688", fontSize: "0.82rem", lineHeight: 1.65 }}>{selected.bio}</p><strong style={{ fontSize: "0.78rem", color: "#554b70" }}>Specializations</strong><div className="tag-row" style={{ marginTop: "0.45rem" }}><span className="mini-tag">{selected.focus}</span><span className="mini-tag">Wellbeing</span><span className="mini-tag">Personal growth</span></div><p style={{ color: "#6f6688", fontSize: "0.78rem" }}><strong>Available:</strong> {selected.availability}</p><div className="btn-row"><Button style={{ width: "100%" }} onClick={() => setBooked(true)}>Book appointment</Button></div>{booked && <Alert variant="success" style={{ marginTop: "0.8rem" }}>Appointment request saved for {selected.availability}.</Alert>}</> : <Alert variant="info">Select a specialist to view their profile.</Alert>}</div>
    </section>
  </div>;
}
