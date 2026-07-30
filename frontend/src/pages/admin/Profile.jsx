function AdminProfile() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#6b3cb8",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "3rem",
              fontWeight: "bold",
            }}
          >
            A
          </div>

          <div>
            <h1 style={{ color: "#6b3cb8", margin: 0 }}>
              System Administrator
            </h1>

            <p style={{ color: "#666", marginTop: "10px" }}>
              Responsible for managing users, specialists, workshops,
              assessments and system resources.
            </p>
          </div>
        </div>

        <div style={styles.grid}>
          <Info title="Full Name" value="Administrator" />
          <Info title="Email" value="admin@mentalhealth.com" />
          <Info title="Phone" value="+254 700 000 000" />
          <Info title="Role" value="System Administrator" />
          <Info title="Department" value="Administration" />
          <Info title="Location" value="Nairobi, Kenya" />
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button style={styles.primary}>
            Edit Profile
          </button>

          <button style={styles.secondary}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div style={styles.info}>
      <strong>{title}</strong>
      <p>{value}</p>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },

  info: {
    background: "#f8f8ff",
    padding: "16px",
    borderRadius: "10px",
  },

  primary: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondary: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AdminProfile;