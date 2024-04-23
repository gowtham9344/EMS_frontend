import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./navbar.css"
import { toast } from 'react-toastify';
import { AuthContext } from '../context/authContext';

function NavBar() {
  const auth = useContext(AuthContext)

  const onLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        toast.success("You have been successfully logged out", auth.toastOptions);
        auth.logout();
    }
  }

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link team-nav">Home</NavLink>
        </li>
      </ul>
        <div className="navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {!auth.isLoggedIn && (
              <li className="nav-item">
                <NavLink to="/login" className="nav-link signin">Sign in</NavLink>
              </li>
            )}
            {auth.isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink to="/teams" className="nav-link team-nav">TeamDetails</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/employees" className="nav-link employee-nav">EmployeeDetails</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/users/editPassword" className="nav-link edit-pass-nav">EditPassword</NavLink>
                </li>
                <li className="nav-item">
                  <Link className="nav-link edit-pass-nav" onClick={onLogout}>Logout</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
