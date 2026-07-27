function Card({ children, className = "", style = {}, ...props }) {
  const baseStyle = {
    background: "#fff",
    border: "1px solid #e8d4ff",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 24px rgba(107, 60, 184, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    padding: "1.5rem",
  };

  return (
    <div style={{ ...baseStyle, ...style }} className={className} {...props}>
      {children}
    </div>
  );
}

export default Card;