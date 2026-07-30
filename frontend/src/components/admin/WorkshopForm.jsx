import { useEffect } from "react";

function WorkshopForm({
  mode,
  formData,
  setFormData,
  selectedWorkshop,
  handleAddWorkshop,
  handleEditWorkshop,
  onClose,
}) {
  useEffect(() => {
    if (selectedWorkshop) {
      setFormData(selectedWorkshop);
    }
  }, [selectedWorkshop, setFormData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "capacity"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "add") {
      handleAddWorkshop();
    } else {
      handleEditWorkshop();
    }
  };

  if (mode !== "add" && mode !== "edit") return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>
          {mode === "add" ? "Add Workshop" : "Edit Workshop"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="title"
            placeholder="Workshop Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="facilitator"
            placeholder="Facilitator"
            value={formData.facilitator}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
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
            <option value="Upcoming">Upcoming</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
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
    width: "450px",
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

export default WorkshopForm;