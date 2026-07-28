import { useMemo, useState } from "react";
import { Badge, Button, Input } from "../../components/ui";
import { educationalResources } from "../../data/educationalResources";

const categories = [["Mental health"], ["Wellness"], ["Personal growth"], ["Relationships"], ["Work & career"], ["Mindfulness"]];

export default function Resources() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All categories");
  const [selectedId, setSelectedId] = useState(educationalResources[0].id);
  const [saved, setSaved] = useState([]);
  const filtered = useMemo(() => educationalResources.filter((resource) => (type === "All categories" || resource.type === type) && `${resource.title} ${resource.description}`.toLowerCase().includes(query.toLowerCase())), [query, type]);
  const selected = filtered.find((resource) => resource.id === selectedId) || filtered[0];
  const toggleSave = (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return <div className="page-shell design-page">
    <div className="design-heading"><div><span className="design-kicker">Resources</span><h2 className="page-title" style={{ fontSize: "1.55rem", marginTop: "0.2rem" }}>Support for everyday growth.</h2></div><Badge variant="success">{saved.length} saved</Badge></div>
    <section className="resources-workspace">
      <div className="compact-card"><h3 style={{ margin: 0, color: "#3d3459", fontSize: "1rem" }}>Resource library</h3><Input className="compact-search" placeholder="Search resources..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ marginTop: "0.8rem" }} /><select aria-label="Resource category" value={type} onChange={(event) => setType(event.target.value)} style={{ width: "100%", marginTop: "0.5rem", padding: "0.55rem", border: "1px solid #e4def2", borderRadius: "0.5rem", color: "#4e4568", background: "#fff" }}><option>All categories</option>{[...new Set(educationalResources.map((resource) => resource.type))].map((resourceType) => <option key={resourceType}>{resourceType}</option>)}</select>
        <div className="resource-list">{filtered.map((resource) => <button type="button" className={`resource-list-item ${selected?.id === resource.id ? "active" : ""}`} key={resource.id} onClick={() => setSelectedId(resource.id)}><span><strong>{resource.title}</strong><small>{resource.type} · {resource.readTime}</small></span></button>)}</div>
      </div>
      <div className="compact-card">{selected ? <><div className="resource-detail-cover"><div style={{ marginTop: "0.9rem" }}><Badge variant="primary">{selected.type}</Badge><h3 style={{ color: "#3d3459", margin: "0.55rem 0" }}>{selected.title}</h3><p className="resource-detail-copy">{selected.description}</p><p className="resource-detail-copy">This guided resource includes simple, practical steps you can return to whenever you need a reset.</p><ul className="resource-detail-copy"><li>Understand the key ideas</li><li>Try a small, actionable exercise</li><li>Save what supports you</li></ul><div className="btn-row"><Button style={{ flex: 1 }}>Open resource</Button><Button variant="secondary" onClick={() => toggleSave(selected.id)}>{saved.includes(selected.id) ? "Saved" : "Save"}</Button></div></div></div></> : <p style={{ color: "#766d90" }}>No resources match your search.</p>}</div>
      <div className="compact-card"><h3 style={{ margin: 0, color: "#3d3459", fontSize: "1rem" }}>Categories</h3><div className="category-grid">{categories.map(([label]) => <button className="category-tile" type="button" key={label} onClick={() => setQuery(label)}><span>{label}</span></button>)}</div><div style={{ borderTop: "1px solid #eeeaf7", marginTop: "1rem", paddingTop: "0.8rem" }}><span className="design-kicker">Bookmarks</span>{saved.length ? saved.map((id) => <p key={id} style={{ color: "#5f5579", fontSize: "0.75rem" }}>{educationalResources.find((resource) => resource.id === id)?.title}</p>) : <p style={{ color: "#817897", fontSize: "0.75rem" }}>Save resources to find them quickly later.</p>}</div></div>
    </section>
  </div>;
}
