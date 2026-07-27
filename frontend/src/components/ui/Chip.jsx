function Chip({ children, active = false, onClick, className = "", style = {}, ...props }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.45rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "700",
    border: "1.5px solid #e8d4ff",
    background: active ? "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)" : "#fff",
    color: active ? "#fff" : "#6b3cb8",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s ease",
    ...style,
  };

  return (
    <button type="button" style={baseStyle} className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default Chip;