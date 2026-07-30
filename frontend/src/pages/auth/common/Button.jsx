export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  fullWidth = false,
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    border: 'none',
    font: 'inherit',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variants = {
    primary: {
      background: '#6b3cb8',
      color: '#fff',
      ':hover': { background: '#5a2d9e' },
    },
    secondary: {
      background: '#e8d4ff',
      color: '#6b3cb8',
      ':hover': { background: '#d4b8f0' },
    },
    outline: {
      background: 'transparent',
      color: '#6b3cb8',
      border: '2px solid #6b3cb8',
      ':hover': { background: '#f5f0ff' },
    },
    danger: {
      background: '#e74c3c',
      color: '#fff',
      ':hover': { background: '#c0392b' },
    },
    success: {
      background: '#20c997',
      color: '#fff',
      ':hover': { background: '#1a7d5c' },
    },
  };

  const style = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
  };

  // Handle hover styles
  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    const hoverStyle = variants[variant]?.[':hover'];
    if (hoverStyle) {
      Object.assign(e.target.style, hoverStyle);
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    const baseVariant = variants[variant];
    if (baseVariant) {
      // Reset to base styles (except width which shouldn't change)
      const { ':hover': _, ...baseStyle } = baseVariant;
      Object.assign(e.target.style, baseStyle);
    }
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}