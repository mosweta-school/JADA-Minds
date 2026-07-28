import { useState } from "react";

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>

      <div style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ paddingRight: "4.5rem" }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            top: "50%",
            right: "1rem",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "#6b3cb8",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;