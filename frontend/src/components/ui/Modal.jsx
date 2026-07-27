import { forwardRef } from "react";

const Modal = forwardRef(function Modal({ children, open, onClose, title, className = "", style: customStyle = {}, ...props }, ref) {
  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(45, 27, 105, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  };

  const dialogStyle = {
    background: "#fff",
    borderRadius: "1.25rem",
    boxShadow: "0 24px 48px rgba(107, 60, 184, 0.2)",
    maxWidth: "560px",
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "1.5rem",
    ...customStyle,
  };

  return (
    <div style={overlayStyle} onClick={onClose} ref={ref} {...props}>
      <div style={dialogStyle} className={className} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, color: "#2d1b69", fontSize: "1.2rem" }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b5b95", padding: "0.25rem 0.5rem" }} aria-label="Close modal">×</button>
        </div>
        {children}
      </div>
    </div>
  );
});

export default Modal;
