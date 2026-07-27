function Badge({ children, variant = "primary", className = "", style = {}, ...props }) {
  const variants = {
    primary: { background: "linear-gradient(135deg, #e8d4ff 0%, #f0e6ff 100%)", color: "#6b3cb8" },
    success: { background: "linear-gradient(135deg, #d4ffe8 0%, #e6fff0 100%)", color: "#1a7d5c" },
    warning: { background: "linear-gradient(135deg, #ffe8d4 0%, #fff0e6 100%)", color: "#b8633c" },
    danger: { background: "linear-gradient(135deg, #ffe8e8 0%, #fff0f0 100%)", color: "#c0392b" },
    info: { background: "linear-gradient(135deg, #d4e8ff 0%, #e6f0ff 100%)", color: "#2980b9" },
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.45rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "700",
    ...variants[variant],
    ...style,
  };

  return (
    <span style={baseStyle} className={className} {...props}>
      {children}
    </span>
  );
}

export default Badge;