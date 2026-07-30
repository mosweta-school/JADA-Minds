function SpecialistProfile() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(107,60,184,.08)",
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
              background: "#d9c7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#6b3cb8",
            }}
          >
            👩‍⚕️
          </div>

          <div>
            <h1 style={{ color: "#6b3cb8", marginBottom: ".5rem" }}>
              Dr. Jane Smith
            </h1>

            <p>Mental Health Specialist</p>
          </div>
        </div>

        <div style={styles.grid}>
          <Info label="Email" value="jane@example.com" />
          <Info label="Phone" value="+254 700 123 456" />
          <Info label="License Number" value="MHS-2026-001" />
          <Info label="Experience" value="8 Years" />
          <Info label="Specialization" value="Clinical Psychology" />
          <Info label="Location" value="Nairobi, Kenya" />
        </div>

        <button style={styles.button}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },

  info: {
    background: "#faf8ff",
    padding: "1rem",
    borderRadius: "10px",
  },

  button: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: ".8rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default SpecialistProfile;