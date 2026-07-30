function Reports() {
  const summary = [
    { title: "Total Users", value: 248 },
    { title: "Specialists", value: 18 },
    { title: "Assessments", value: 326 },
    { title: "Workshops", value: 12 },
  ];

  const assessments = [
    { name: "PHQ-9", completed: 120, pending: 18 },
    { name: "GAD-7", completed: 98, pending: 12 },
    { name: "DASS-21", completed: 75, pending: 9 },
  ];

  const workshops = [
    {
      title: "Managing Anxiety",
      capacity: 30,
      registered: 28,
      attendance: 26,
    },
    {
      title: "Stress Management",
      capacity: 25,
      registered: 22,
      attendance: 20,
    },
    {
      title: "Mindfulness Basics",
      capacity: 20,
      registered: 18,
      attendance: 17,
    },
  ];

  const specialists = [
    {
      name: "Dr. Jane Smith",
      clients: 20,
      sessions: 45,
      reports: 45,
    },
    {
      name: "Dr. Mark Brown",
      clients: 18,
      sessions: 39,
      reports: 39,
    },
    {
      name: "Dr. Sarah Johnson",
      clients: 15,
      sessions: 33,
      reports: 33,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: "#6b3cb8" }}>Reports</h1>

        <div>
          <button style={styles.button}>Export PDF</button>

          <button
            style={{
              ...styles.button,
              marginLeft: ".75rem",
            }}
          >
            Export Excel
          </button>
        </div>
      </div>

      <div style={styles.cards}>
        {summary.map((item) => (
          <div key={item.title} style={styles.card}>
            <h3>{item.title}</h3>
            <h1 style={{ color: "#6b3cb8" }}>{item.value}</h1>
          </div>
        ))}
      </div>

      <Section title="Assessment Statistics">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.header}>Assessment</th>
              <th style={styles.header}>Completed</th>
              <th style={styles.header}>Pending</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((a) => (
              <tr key={a.name}>
                <td style={styles.cell}>{a.name}</td>
                <td style={styles.cell}>{a.completed}</td>
                <td style={styles.cell}>{a.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Workshop Statistics">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.header}>Workshop</th>
              <th style={styles.header}>Capacity</th>
              <th style={styles.header}>Registered</th>
              <th style={styles.header}>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {workshops.map((w) => (
              <tr key={w.title}>
                <td style={styles.cell}>{w.title}</td>
                <td style={styles.cell}>{w.capacity}</td>
                <td style={styles.cell}>{w.registered}</td>
                <td style={styles.cell}>{w.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Specialist Activity">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.header}>Specialist</th>
              <th style={styles.header}>Clients</th>
              <th style={styles.header}>Sessions</th>
              <th style={styles.header}>Reports</th>
            </tr>
          </thead>

          <tbody>
            {specialists.map((s) => (
              <tr key={s.name}>
                <td style={styles.cell}>{s.name}</td>
                <td style={styles.cell}>{s.clients}</td>
                <td style={styles.cell}>{s.sessions}</td>
                <td style={styles.cell}>{s.reports}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ color: "#6b3cb8" }}>{title}</h2>

      <div style={styles.section}>{children}</div>
    </div>
  );
}

const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "1rem",
  },

  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(107,60,184,.08)",
  },

  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(107,60,184,.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  header: {
    textAlign: "left",
    padding: "1rem",
    borderBottom: "1px solid #eee",
    color: "#6b3cb8",
  },

  cell: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
  },

  button: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Reports;