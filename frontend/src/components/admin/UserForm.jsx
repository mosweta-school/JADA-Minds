import { useEffect } from "react";

function UserForm({
  mode,
  formData,
  setFormData,
  selectedUser,
  handleAddUser,
  handleEditUser,
  onClose,
}) {
  useEffect(() => {
    if (mode === "edit" && selectedUser) {
      setFormData(selectedUser);
    }
  }, [mode, selectedUser, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "add") {
      handleAddUser();
    } else {
      handleEditUser();
    }
  };

  if (!mode || (mode !== "add" && mode !== "edit")) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{mode === "add" ? "Add User" : "Edit User"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
            required
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
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              {mode === "add" ? "Add User" : "Save Changes"}
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
    width: "400px",
  },
  input: {
    width: "100%",
    padding: ".8rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: ".75rem",
  },
};

export default UserForm;