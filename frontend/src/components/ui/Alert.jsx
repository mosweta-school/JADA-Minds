function Alert({ children, variant = "info", className = "", style: customStyle = {}, ...props }) {
  const variants = {
    info: { background: "#e6f0ff", border: "1px solid #b8d4f0", color: "#2980b9", icon: "ℹ️" },
    success: { background: "#e6fff0", border: "1px solid #b8e8d4", color: "#1a7d5c", icon: "✅" },
    warning: { background: "#fff8f0", border: "1px solid #f0d8b8", color: "#b8633c", icon: "⚠️" },
    error: { background: "#fff0f0", border: "1px solid #f0b8b8", color: "#c0392b", icon: "❌" },
  };

  const v = variants[variant];
  const alertStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "1rem 1.25rem",
    borderRadius: "0.85rem",
    background: v.background,
    border: v.border,
    color: v.color,
    lineHeight: "1.6",
    ...customStyle,
  };

  return (
    <div style={alertStyle} className={className} {...props}>
      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{v.icon}</span>
      <div>{children}</div>
    </div>
  );
}

export default Alert;
