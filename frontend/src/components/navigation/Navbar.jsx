function Navbar() {
  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #e8d4ff", boxShadow: "0 2px 8px rgba(107, 60, 184, 0.08)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#6b3cb8", margin: "0" }}>JADA Minds</h1>
        <p style={{ fontSize: "0.85rem", color: "#6b5b95", margin: "0.2rem 0 0" }}>Wellness support for everyday growth</p>
      </div>
      <span style={{ borderRadius: "999px", background: "#f0e6ff", padding: "0.5rem 1rem", fontSize: "0.85rem", fontWeight: "700", color: "#6b3cb8" }}>
        Client experience
      </span>
    </nav>
  );
}

export default Navbar;