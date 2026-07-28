import { useState } from "react";
import specialistsData from "../../data/specialists";
import SpecialistForm from "../../components/admin/SpecialistForm";
import DeleteSpecialistDialog from "../../components/admin/DeleteSpecialistDialog";


function AdminSpecialists() {
    const [specialists, setSpecialists] = useState(specialistsData);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [mode, setMode] = useState(null);

    const emptySpecialist = {
    name: "",
    specialty: "",
    email: "",
    status: "Active",
    };

    const [formData, setFormData] = useState(emptySpecialist);

    const handleAddSpecialist = () => {
    const newSpecialist = {
        id: Date.now(),
        ...formData,
    };

    setSpecialists((prev) => [...prev, newSpecialist]);
    setFormData(emptySpecialist);
    setSelectedSpecialist(null);
    setMode(null);
    };

    const handleEditSpecialist = () => {
    setSpecialists((prev) =>
        prev.map((specialist) =>
        specialist.id === selectedSpecialist.id
            ? { ...selectedSpecialist, ...formData }
            : specialist
        )
    );

    setSelectedSpecialist(null);
    setFormData(emptySpecialist);
    setMode(null);
    };

    const handleDeleteSpecialist = () => {
    setSpecialists((prev) =>
        prev.filter(
        (specialist) => specialist.id !== selectedSpecialist.id
        )
    );

    setSelectedSpecialist(null);
    setMode(null);
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
          Specialists
        </h1>

        <button
            onClick={() => {
                setSelectedSpecialist(null);
                setFormData(emptySpecialist);
                setMode("add");
            }}
            style={styles.button}
            >
            + Add Specialist
         </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f5f1ff" }}>
              <th style={styles.header}>Name</th>
              <th style={styles.header}>Specialty</th>
              <th style={styles.header}>Email</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {specialists.map((specialist) => (
              <tr key={specialist.id}>
                <td style={styles.cell}>{specialist.name}</td>
                <td style={styles.cell}>{specialist.specialty}</td>
                <td style={styles.cell}>{specialist.email}</td>
                <td style={styles.cell}>{specialist.status}</td>

                <td style={styles.cell}>
                  <button
                    onClick={() => {
                        setSelectedSpecialist(specialist);
                        setFormData(specialist);
                        setMode("edit");
                    }}
                    style={styles.actionButton}
                    >
                    Edit
                </button>

                  <button
                    onClick={() => {
                        setSelectedSpecialist(specialist);
                        setMode("delete");
                    }}
                    style={{
                        ...styles.actionButton,
                        background: "#dc3545",
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

    <SpecialistForm
      mode={mode}
      formData={formData}
      setFormData={setFormData}
      selectedSpecialist={selectedSpecialist}
      handleAddSpecialist={handleAddSpecialist}
      handleEditSpecialist={handleEditSpecialist}
      onClose={() => {
        setMode(null);
        setSelectedSpecialist(null);
        setFormData(emptySpecialist);
      }}
    />

    <DeleteSpecialistDialog
      mode={mode}
      selectedSpecialist={selectedSpecialist}
      handleDeleteSpecialist={handleDeleteSpecialist}
      onClose={() => {
        setMode(null);
        setSelectedSpecialist(null);
      }}
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

export default AdminSpecialists;