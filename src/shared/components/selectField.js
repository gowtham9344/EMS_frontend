import React from 'react';
import './selectField.css'

function SelectField({ value, label, options, onChange }) {
  return (
    <div className="input-container">
      <label>
        {label}
        <select value={value} onChange={onChange}>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SelectField;
