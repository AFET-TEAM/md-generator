import React from 'react';

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  options = [],
  children
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label} {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Seçiniz...</option>
        {children || options?.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// Performance Optimization: Wrapped in React.memo to prevent re-rendering
// all dropdowns when unrelated state (like text inputs) changes in the parent form.
export default React.memo(SelectField);
