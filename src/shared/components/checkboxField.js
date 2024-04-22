import React from 'react';
import './checkboxField.css'

function CheckboxField({ label, value, checked, onChange, disabled }) {
  return (
    <>
      <label className='labels-dropdown'>
        <input
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        {label}
      </label>
    </>
  );
}

export default CheckboxField;
