function Button({ children, variant = "primary", size = "md", disabled = false, loading = false, onClick, type = "button", className = "", ...props }) {
  const baseStyles = {
    border: "none",
    borderRadius: "999px",
    fontWeight: "700",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    opacity: disabled || loading ? 0.6 : 1,
    font: "inherit",
  };

  const sizes = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.85rem" },
    md: { padding: "0.8rem 1.3rem", fontSize: "0.95rem" },
    lg: { padding: "1rem 1.6rem", fontSize: "1.05rem" },
  };

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(107, 60, 184, 0.25)",
    },
    secondary: {
      background: "#f0e6ff",
      color: "#6b3cb8",
      border: "1.5px solid #e8d4ff",
    },
    outline: {
      background: "transparent",
      color: "#6b3cb8",
      border: "2px solid #6b3cb8",
    },
    ghost: {
      background: "transparent",
      color: "#6b5b95",
    },
    danger: {
      background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(231, 76, 60, 0.25)",
    },
    success: {
      background: "linear-gradient(135deg, #20c997 0%, #1a7d5c 100%)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(32, 201, 151, 0.25)",
    },
  };

  const style = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <button type={type} style={style} disabled={disabled || loading} onClick={onClick} className={className} {...props}>
      {loading && <span style={{ display: "inline-block", width: "1em", height: "1em", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
      {children}
    </button>
  );
}

export default Button;