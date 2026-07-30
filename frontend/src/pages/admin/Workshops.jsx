import { useState } from "react";
import workshopsData from "../../data/workshops";
import WorkshopForm from "../../components/admin/WorkshopForm";
import DeleteWorkshopDialog from "../../components/admin/DeleteWorkshopDialog";

function AdminWorkshops() {
  const [workshops, setWorkshops] = useState(workshopsData);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [mode, setMode] = useState(null);

  const emptyWorkshop = {
    title: "",
    facilitator: "",
    date: "",
    time: "",
    capacity: "",
    status: "",
  };

  const [formData, setFormData] = useState(emptyWorkshop);

  const closeModal = () => {
    setMode(null);
    setSelectedWorkshop(null);
    setFormData(emptyWorkshop);
  };

  const handleAddWorkshop = () => {
    setWorkshops((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...formData,
      },
    ]);

    closeModal();
  };

  const handleEditWorkshop = () => {
    setWorkshops((prev) =>
      prev.map((workshop) =>
        workshop.id === selectedWorkshop.id
          ? { ...selectedWorkshop, ...formData }
          : workshop
      )
    );

    closeModal();
  };

  const handleDeleteWorkshop = () => {
    setWorkshops((prev) =>
      prev.filter(
        (workshop) => workshop.id !== selectedWorkshop.id
      )
    );

    closeModal();
  };

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
        <h1 style={{ color: "#6b3cb8", margin: 0 }}>
          Workshops
        </h1>

        <button
          style={styles.button}
          onClick={() => {
            setSelectedWorkshop(null);
            setFormData(emptyWorkshop);
            setMode("add");
          }}
        >
          + Add Workshop
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f5f1ff" }}>
              <th style={styles.header}>Title</th>
              <th style={styles.header}>Facilitator</th>
              <th style={styles.header}>Date</th>
              <th style={styles.header}>Time</th>
              <th style={styles.header}>Capacity</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {workshops.map((workshop) => (
              <tr key={workshop.id}>
                <td style={styles.cell}>{workshop.title}</td>
                <td style={styles.cell}>{workshop.facilitator}</td>
                <td style={styles.cell}>{workshop.date}</td>
                <td style={styles.cell}>{workshop.time}</td>
                <td style={styles.cell}>{workshop.capacity}</td>
                <td style={styles.cell}>{workshop.status}</td>

                <td style={styles.cell}>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      setSelectedWorkshop(workshop);
                      setFormData(workshop);
                      setMode("edit");
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      ...styles.actionButton,
                      background: "#dc3545",
                    }}
                    onClick={() => {
                      setSelectedWorkshop(workshop);
                      setMode("delete");
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WorkshopForm
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        selectedWorkshop={selectedWorkshop}
        handleAddWorkshop={handleAddWorkshop}
        handleEditWorkshop={handleEditWorkshop}
        onClose={closeModal}
      />

      <DeleteWorkshopDialog
        mode={mode}
        selectedWorkshop={selectedWorkshop}
        handleDeleteWorkshop={handleDeleteWorkshop}
        onClose={closeModal}
      />
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
    textAlign: "left",
    padding: "1rem",
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
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  actionButton: {
    marginRight: ".5rem",
    border: "none",
    background: "#6b3cb8",
    color: "#fff",
    padding: ".45rem .8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminWorkshops;