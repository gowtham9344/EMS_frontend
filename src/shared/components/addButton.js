import React from 'react';
import { Link } from 'react-router-dom';

function AddButton({ active,handleNew }) {
  return (
    <div className="add-button" style={{ display: active ? 'block' : 'none' }}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link onClick={handleNew} className="nav-link">
            <i className="bi bi-plus-circle add-team1"></i> 
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AddButton;