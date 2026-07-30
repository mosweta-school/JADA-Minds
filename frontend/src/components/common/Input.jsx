// frontend/src/components/common/Input.jsx

import { forwardRef, useState } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="input-group">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: '#e74c3c' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
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
            transition: 'border-color 0.2s',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          className={className}
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
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <span style={{ color: '#e74c3c', fontSize: '0.875rem' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ color: '#6b5b95', fontSize: '0.875rem' }}>{helperText}</span>
      )}
    </div>
  );
});