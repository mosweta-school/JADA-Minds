export function Card({ children, className = '', ...props }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 8px 24px rgba(107, 60, 184, 0.08)',
        padding: '2rem',
        border: '1px solid #e8d4ff',
        maxWidth: '100%',
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}