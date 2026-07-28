function DeleteSpecialistDialog({
  mode,
  selectedSpecialist,
  handleDeleteSpecialist,
  onClose,
}) {
  if (mode !== "delete" || !selectedSpecialist) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Delete Specialist</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedSpecialist.name}</strong>?
        </p>

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleDeleteSpecialist}
            style={styles.deleteButton}
          >
            Delete
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
    width: "400px",
    textAlign: "center",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
  },

  deleteButton: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: ".6rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default DeleteSpecialistDialog;