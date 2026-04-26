import { useState } from 'react'

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options,        // for select
  hint,
  disabled = false,
  min,
  rows,
}) {
  const [focused, setFocused] = useState(false)

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    background: disabled ? 'var(--bg-subtle)' : '#fff',
    border: `1.5px solid ${focused ? 'var(--border-focus)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxShadow: focused ? '0 0 0 3px rgba(184,149,42,0.1)' : 'none',
    resize: type === 'textarea' ? 'vertical' : undefined,
    cursor: disabled ? 'not-allowed' : 'text',
  }

  return (
    <div style={{ marginBottom: '18px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: focused ? 'var(--gold)' : 'var(--text-secondary)',
          marginBottom: '6px',
          transition: 'color 0.18s',
          letterSpacing: '0.01em',
        }}>
          {label}{required && <span style={{ color: 'var(--gold)', marginLeft: '3px' }}>*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyle, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <option value="">Select…</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}

      {hint && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '5px' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
