import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleTitle = {
    client: "Client Portal",
    specialist: "Specialist Portal",
    admin: "Admin Portal",
  };

  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "1px solid #e8d4ff",
        boxShadow: "0 2px 8px rgba(107, 60, 184, 0.08)",
        padding: "1rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color: "#6b3cb8",
            fontSize: "1.3rem",
            fontWeight: "700",
          }}
        >
          JADA Minds
        </h1>

        <p
          style={{
            margin: "4px 0 0",
            color: "#6b5b95",
            fontSize: "0.85rem",
          }}
        >
          Wellness support for everyday growth
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              color: "#6b3cb8",
              fontSize: "0.95rem",
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b5b95",
            }}
          >
            {displayEmail}
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#9b8bb7",
              marginTop: "2px",
            }}
          >
            {roleTitle[user?.role] || "JADA Minds"}
          </div>
        </div>

        <span
          style={{
            background: "#f0e6ff",
            color: "#6b3cb8",
            padding: "0.45rem 0.9rem",
            borderRadius: "999px",
            fontWeight: "700",
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          {user?.role || "Guest"}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "#6b3cb8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;