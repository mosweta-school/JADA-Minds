function EmptyState({ emoji = "", title = "Nothing here yet", description = "", actionLabel = "", onAction, className = "", style = {}, ...props }) {
  return (
    <div className={`empty-state ${className}`.trim()} style={{ ...style }} {...props}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{emoji}</div>
      <h3 style={{ color: "#2d1b69", marginBottom: "0.5rem" }}>{title}</h3>
      {description && <p style={{ color: "#6b5b95", marginBottom: "1.2rem" }}>{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="button button-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
