import useAuth from "../../hooks/useAuth";
import { clientStats } from "../../data/dashboardData";

function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            color: "#6b3cb8",
            marginBottom: ".4rem",
          }}
        >
          Welcome back, {user?.name}
        </h1>

        <p
          style={{
            color: "#6b5b95",
            margin: 0,
          }}
        >
          Here's an overview of your wellness journey.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "1.5rem",
        }}
      >
        {clientStats.map((card) => (
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
                fontSize: ".95rem",
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

      <div
        style={{
          marginTop: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(107,60,184,.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#6b3cb8",
          }}
        >
          Next Recommended Action
        </h2>

        <p
          style={{
            color: "#6b5b95",
            marginBottom: 0,
          }}
        >
          Complete your next wellness assessment and explore the latest mental
          health resources recommended for you.
        </p>
      </div>
    </div>
  );
}

export default ClientDashboard;