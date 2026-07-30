import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/assessment", label: "Assessment" },
  { to: "/results", label: "Results" },
  { to: "/resources", label: "Resources" },
  { to: "/specialists", label: "Specialists" },
  { to: "/workshops", label: "Workshops" },
  { to: "/progress", label: "Progress" },
  { to: "/profile", label: "Profile" },
];

function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(45, 27, 105, 0.5)",
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          background: "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)",
          color: "#fff",
          padding: "1.5rem",
          zIndex: 1000,
          boxShadow: "4px 0 16px rgba(107, 60, 184, 0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#fff" }}>JADA Minds</h2>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem 0.5rem" }} aria-label="Close menu">×</button>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  color: "#fff",
                  background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                  fontWeight: isActive ? "700" : "500",
                })}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default MobileSidebar;