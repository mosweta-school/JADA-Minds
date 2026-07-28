function DeleteUserDialog({
  mode,
  selectedUser,
  handleDeleteUser,
  onClose,
}) {
  if (mode !== "delete" || !selectedUser) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Delete User</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedUser.name}</strong>?
        </p>

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleDeleteUser}
            style={{
              background: "#dc3545",
              color: "#fff",
            }}
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
    width: "360px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: ".75rem",
    marginTop: "1.5rem",
  },
};

export default DeleteUserDialog;