import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, helperText, className = "", style = {}, ...props }, ref) {
  return (
    <div className={`input-group ${className}`.trim()} style={{ ...style }}>
      {label && <label>{label}</label>}
      <input ref={ref} style={{ borderColor: error ? "#e74c3c" : "#e8d4ff" }} {...props} />
      {error && <span style={{ color: "#e74c3c", fontSize: "0.8rem", fontWeight: "600" }}>{error}</span>}
      {helperText && !error && <span style={{ color: "#6b5b95", fontSize: "0.8rem" }}>{helperText}</span>}
    </div>
  );
});

export default Input;
