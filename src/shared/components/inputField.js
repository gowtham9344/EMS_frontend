import React from 'react';
import './inputField.css'

function InputField({ label, value, onChange, required,errors }) {
  return (
    <div className="input-container">
      <label>
        {label} <span className="required">{required ? '*' : ''}</span>
        <input type="text" value={value} onChange={onChange} />
      </label>
      {errors[label.toLowerCase()] && <span className="error-message">{errors[label.toLowerCase()]}</span>}
    </div>
  );
}

export default InputField;
