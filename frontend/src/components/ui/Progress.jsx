function Progress({ value = 0, max = 100, label = "", variant = "default", className = "", style = {}, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantColors = {
    default: { bar: "linear-gradient(90deg, #6b3cb8 0%, #8e5fd4 50%, #20c997 100%)", track: "#e8d4ff" },
    success: { bar: "linear-gradient(90deg, #20c997 0%, #1a7d5c 100%)", track: "#d4ffe8" },
    warning: { bar: "linear-gradient(90deg, #ffa733 0%, #f0c040 100%)", track: "#ffe8d4" },
    danger: { bar: "linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)", track: "#ffe8e8" },
  };

  const c = variantColors[variant];

  return (
    <div className={`progress-track ${className}`.trim()} style={{ ...style }} {...props}>
      <div className="progress-bar" style={{ width: `${percentage}%`, background: c.bar }} />
      {label && (
        <span style={{ display: "block", textAlign: "right", fontSize: "0.8rem", color: "#6b5b95", marginTop: "0.3rem", fontWeight: "600" }}>
          {label}
        </span>
      )}
    </div>
  );
}

export default Progress;
