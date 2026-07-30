import { forwardRef, useState } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    required = false,
    fullWidth = true,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div
      style={{
        marginBottom: '1.25rem',
        width: fullWidth ? '100%' : 'auto',
      }}
      className={className}
    >
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2d1b69',
            fontSize: '0.95rem',
          }}
        >
          {label}
          {required && <span style={{ color: '#e74c3c', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingRight: isPassword ? '3.5rem' : '1rem',
            borderRadius: '0.5rem',
            border: `2px solid ${error ? '#e74c3c' : '#e8d4ff'}`,
            fontSize: '1rem',
            background: '#faf5ff',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#2d1b69',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#6b3cb8';
            e.target.style.boxShadow = '0 0 0 3px rgba(107, 60, 184, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#e74c3c' : '#e8d4ff';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#6b5b95',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && (
        <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ color: '#6b5b95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
});