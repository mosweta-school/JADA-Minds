function DeleteResourceDialog({
  mode,
  selectedResource,
  handleDeleteResource,
  onClose,
}) {
  if (mode !== "delete") return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Delete Resource</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedResource?.title}</strong>?
        </p>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancel}>
            Cancel
          </button>

          <button
            onClick={handleDeleteResource}
            style={styles.delete}
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
    background: "rgba(0,0,0,.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "400px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: ".75rem",
    marginTop: "1.5rem",
  },

  cancel: {
    padding: ".7rem 1.2rem",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  delete: {
    padding: ".7rem 1.2rem",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default DeleteResourceDialog;