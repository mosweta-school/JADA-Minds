import { forwardRef } from "react";

const Select = forwardRef(function Select({ label, error, helperText, className = "", style = {}, children, ...props }, ref) {
  return (
    <div className={`input-group ${className}`.trim()} style={{ ...style }}>
      {label && <label>{label}</label>}
      <select ref={ref} style={{ borderColor: error ? "#e74c3c" : "#e8d4ff" }} {...props}>
        {children}
      </select>
      {error && <span style={{ color: "#e74c3c", fontSize: "0.8rem", fontWeight: "600" }}>{error}</span>}
      {helperText && !error && <span style={{ color: "#6b5b95", fontSize: "0.8rem" }}>{helperText}</span>}
    </div>
  );
});

export default Select;
