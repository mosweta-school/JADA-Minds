import { adminStats } from "../../data/dashboardData";

function AdminDashboard() {
  return (
    <div>
      <h1
        style={{
          marginBottom: "2rem",
          color: "#6b3cb8",
        }}
      >
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {adminStats.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(107,60,184,.08)",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#6b5b95",
                fontSize: "0.95rem",
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                margin: "1rem 0 0",
                fontSize: "2rem",
                fontWeight: "700",
                color: "#6b3cb8",
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;