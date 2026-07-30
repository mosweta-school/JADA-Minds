import { useEffect } from "react";

function AssessmentForm({
  mode,
  formData,
  setFormData,
  selectedAssessment,
  handleAddAssessment,
  handleEditAssessment,
  onClose,
}) {
  useEffect(() => {
    if (selectedAssessment) {
      setFormData(selectedAssessment);
    }
  }, [selectedAssessment, setFormData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "questions"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "add") {
      handleAddAssessment();
    } else {
      handleEditAssessment();
    }
  };

  if (mode !== "add" && mode !== "edit") return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>
          {mode === "add"
            ? "Add Assessment"
            : "Edit Assessment"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="number"
            name="questions"
            placeholder="Number of Questions"
            value={formData.questions}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancel}
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" style={styles.save}>
              {mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "420px",
  },

  input: {
    width: "100%",
    padding: ".75rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: ".75rem",
  },

  cancel: {
    padding: ".7rem 1.2rem",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  save: {
    padding: ".7rem 1.2rem",
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AssessmentForm;