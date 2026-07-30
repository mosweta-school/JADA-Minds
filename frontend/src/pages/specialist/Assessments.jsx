const assessments = [
  {
    id: 1,
    client: "John Doe",
    assessment: "PHQ-9",
    score: 17,
    severity: "Moderate",
    date: "2026-07-30",
    status: "Pending Review",
  },
  {
    id: 2,
    client: "Mary Wanjiku",
    assessment: "GAD-7",
    score: 8,
    severity: "Mild",
    date: "2026-07-29",
    status: "Reviewed",
  },
  {
    id: 3,
    client: "Peter Kimani",
    assessment: "DASS-21",
    score: 26,
    severity: "Severe",
    date: "2026-07-28",
    status: "Pending Review",
  },
];

function Assessment() {
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
        <h1 style={{ color: "#6b3cb8" }}>Client Assessments</h1>

        <input
          placeholder="Search client..."
          style={styles.search}
        />
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.header}>Client</th>
              <th style={styles.header}>Assessment</th>
              <th style={styles.header}>Score</th>
              <th style={styles.header}>Severity</th>
              <th style={styles.header}>Date</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Action</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((item) => (
              <tr key={item.id}>
                <td style={styles.cell}>{item.client}</td>
                <td style={styles.cell}>{item.assessment}</td>
                <td style={styles.cell}>{item.score}</td>
                <td style={styles.cell}>{item.severity}</td>
                <td style={styles.cell}>{item.date}</td>
                <td style={styles.cell}>{item.status}</td>

                <td style={styles.cell}>
                  <button
                    style={styles.review}
                    onClick={() =>
                      alert(
                        `Reviewing ${item.client}'s ${item.assessment} assessment`
                      )
                    }
                  >
                    Review
                  </button>

                  <button
                    style={styles.view}
                    onClick={() =>
                      alert(
                        `Viewing ${item.client}'s assessment`
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(107,60,184,.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  header: {
    padding: "1rem",
    textAlign: "left",
    color: "#6b3cb8",
    borderBottom: "1px solid #eee",
  },

  cell: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
  },

  search: {
    padding: ".8rem",
    width: "250px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  review: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: ".45rem .8rem",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: ".5rem",
  },

  view: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: ".45rem .8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Assessment;