import React, { useMemo } from 'react';

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  options,
  children
}) => {
  // Performance Optimization: Memoize the mapped options to prevent creating
  // new React elements on every render of SelectField (e.g., when 'value' changes).
  const memoizedOptions = useMemo(() => {
    if (children) return null;
    return options?.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  }, [options, children]);

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
        {children || memoizedOptions}
      </select>
    </div>
  );
};

// Performance Optimization: Wrapped in React.memo to prevent re-rendering
// all dropdowns when unrelated state (like text inputs) changes in the parent form.
export default React.memo(SelectField);
