export function Alert({ children, variant = 'info', className = '', ...props }) {
  const variants = {
    info: { background: '#e6f0ff', border: '#b8d4f0', color: '#2980b9', icon: 'ℹ️' },
    success: { background: '#e6fff0', border: '#b8e8d4', color: '#1a7d5c', icon: '✅' },
    warning: { background: '#fff8f0', border: '#f0d8b8', color: '#b8633c', icon: '⚠️' },
    error: { background: '#fff0f0', border: '#f0b8b8', color: '#c0392b', icon: '❌' },
  };

  const v = variants[variant] || variants.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '0.5rem',
        background: v.background,
        border: `1px solid ${v.border}`,
        color: v.color,
        fontSize: '0.95rem',
        lineHeight: '1.6',
      }}
      className={className}
      {...props}
    >
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{v.icon}</span>
      <div>{children}</div>
    </div>
  );
}