import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const clientLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assessment", label: "Assessment" },
  { to: "/results", label: "Results" },
  { to: "/resources", label: "Resources" },
  { to: "/specialists", label: "Specialists" },
  { to: "/workshops", label: "Workshops" },
  { to: "/profile", label: "Profile" },
];

const specialistLinks = [
  { to: "/specialist", label: "Dashboard" },
  { to: "/specialist/assessments", label: "Assessments" },
  { to: "/specialist/notes", label: "Notes" },
  { to: "/specialist/profile", label: "Profile" },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/specialists", label: "Specialists" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/workshops", label: "Workshops" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/profile", label: "Profile" },
];

function Sidebar() {
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "specialist"
      ? specialistLinks
      : clientLinks;

  return (
    <aside
      style={{
        width: "240px",
        background: "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)",
        color: "#fff",
        padding: "1.5rem",
        flexShrink: 0,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(107, 60, 184, 0.15)",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              style={({ isActive }) => ({
                display: "block",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color: "#fff",
                background: isActive
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
                fontWeight: isActive ? "700" : "500",
              })}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const clientLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assessment", label: "Assessment" },
  { to: "/results", label: "Results" },
  { to: "/resources", label: "Resources" },
  { to: "/specialists", label: "Specialists" },
  { to: "/workshops", label: "Workshops" },
  { to: "/profile", label: "Profile" },
];

const specialistLinks = [
  { to: "/specialist", label: "Dashboard" },
  { to: "/specialist/assessments", label: "Assessments" },
  { to: "/specialist/notes", label: "Notes" },
  { to: "/specialist/profile", label: "Profile" },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/specialists", label: "Specialists" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/workshops", label: "Workshops" },
  { to: "/admin/reports", label: "Reports" },
];

function Sidebar() {
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "specialist"
      ? specialistLinks
      : clientLinks;

  return (
    <aside
      style={{
        width: "240px",
        background: "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)",
        color: "#fff",
        padding: "1.5rem",
        flexShrink: 0,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(107, 60, 184, 0.15)",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              style={({ isActive }) => ({
                display: "block",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color: "#fff",
                background: isActive
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
                fontWeight: isActive ? "700" : "500",
              })}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

