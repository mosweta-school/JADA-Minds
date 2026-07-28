import { useState } from "react";
import usersData from "../../data/users";
import UserForm from "../../components/admin/UserForm";
import DeleteUserDialog from "../../components/admin/DeleteUserDialog";

function Users() {
  const [users, setUsers] = useState(usersData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState(null);

  const emptyUser = {
    name: "",
    email: "",
    role: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyUser);

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      ...formData,
    };

    setUsers((prev) => [...prev, newUser]);
    setFormData(emptyUser);
    setSelectedUser(null);
    setMode(null);
  };

  const handleEditUser = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? { ...selectedUser, ...formData }
          : user
      )
    );

    setSelectedUser(null);
    setFormData(emptyUser);
    setMode(null);
  };

  const handleDeleteUser = () => {
    setUsers((prev) =>
      prev.filter((user) => user.id !== selectedUser.id)
    );

    setSelectedUser(null);
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
        <h1
          style={{
            color: "#6b3cb8",
            margin: 0,
          }}
        >
          User Management
        </h1>

        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData(emptyUser);
            setMode("add");
          }}
          style={{
            background: "#6b3cb8",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add User
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(107,60,184,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f1ff" }}>
              <th style={styles.header}>Name</th>
              <th style={styles.header}>Email</th>
              <th style={styles.header}>Role</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.cell}>{user.name}</td>
                <td style={styles.cell}>{user.email}</td>
                <td style={styles.cell}>{user.role}</td>
                <td style={styles.cell}>{user.status}</td>

                <td style={styles.cell}>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData(user);
                      setMode("edit");
                    }}
                    style={styles.actionButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUser(user);
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
            <UserForm
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        selectedUser={selectedUser}
        handleAddUser={handleAddUser}
        handleEditUser={handleEditUser}
        onClose={() => {
          setMode(null);
          setSelectedUser(null);
          setFormData(emptyUser);
        }}
      />

      <DeleteUserDialog
        mode={mode}
        selectedUser={selectedUser}
        handleDeleteUser={handleDeleteUser}
        onClose={() => {
          setMode(null);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

const styles = {
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

export default Users;