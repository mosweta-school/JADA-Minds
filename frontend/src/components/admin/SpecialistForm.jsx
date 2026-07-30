import { useEffect } from "react";

function SpecialistForm({
  mode,
  formData,
  setFormData,
  selectedSpecialist,
  handleAddSpecialist,
  handleEditSpecialist,
  onClose,
}) {
  useEffect(() => {
    if (selectedSpecialist) {
      setFormData(selectedSpecialist);
    }
  }, [selectedSpecialist, setFormData]);

  if (!mode || (mode !== "add" && mode !== "edit")) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (mode === "add") {
      handleAddSpecialist();
    } else {
      handleEditSpecialist();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>
          {mode === "add" ? "Add Specialist" : "Edit Specialist"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="specialty"
          placeholder="Specialty"
          value={formData.specialty}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>
            {mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
    borderRadius: "10px",
    width: "420px",
  },

  input: {
    width: "100%",
    padding: ".8rem",
    marginBottom: "1rem",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
  },
};

export default SpecialistForm;