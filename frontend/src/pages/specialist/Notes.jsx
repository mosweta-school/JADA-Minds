import { useState } from "react";

const notes = [
  {
    id: 1,
    client: "John Doe",
    assessment: "PHQ-9",
    date: "2026-07-30",
    status: "Pending",
  },
  {
    id: 2,
    client: "Mary Wanjiku",
    assessment: "GAD-7",
    date: "2026-07-29",
    status: "Completed",
  },
  {
    id: 3,
    client: "Peter Kimani",
    assessment: "DASS-21",
    date: "2026-07-28",
    status: "Pending",
  },
];

function Notes() {
  const [selectedNote, setSelectedNote] = useState(null);

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
        <h1 style={{ color: "#6b3cb8" }}>Client Notes</h1>

        <button
          style={styles.button}
          onClick={() =>
            setSelectedNote({
              client: "New Client",
              assessment: "",
              date: new Date().toISOString().split("T")[0],
              status: "Draft",
            })
          }
        >
          + Add Note
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.header}>Client</th>
              <th style={styles.header}>Assessment</th>
              <th style={styles.header}>Date</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Action</th>
            </tr>
          </thead>

          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td style={styles.cell}>{note.client}</td>
                <td style={styles.cell}>{note.assessment}</td>
                <td style={styles.cell}>{note.date}</td>
                <td style={styles.cell}>{note.status}</td>

                <td style={styles.cell}>
                  <button
                    style={styles.action}
                    onClick={() => setSelectedNote(note)}
                  >
                    View
                  </button>

                  <button
                    style={{
                      ...styles.action,
                      background: "#28a745",
                    }}
                    onClick={() => setSelectedNote(note)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNote && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ color: "#6b3cb8" }}>Client Note</h2>

            <p><strong>Client:</strong> {selectedNote.client}</p>
            <p><strong>Assessment:</strong> {selectedNote.assessment}</p>
            <p><strong>Date:</strong> {selectedNote.date}</p>
            <p><strong>Status:</strong> {selectedNote.status}</p>

            <button
              style={styles.button}
              onClick={() => setSelectedNote(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
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

  button: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: ".8rem 1.3rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  action: {
    marginRight: ".5rem",
    border: "none",
    background: "#6b3cb8",
    color: "#fff",
    padding: ".45rem .8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 8px 20px rgba(0,0,0,.2)",
  },
};

export default Notes;