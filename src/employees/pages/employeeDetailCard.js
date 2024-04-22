import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/authContext';

export default function EmployeeDetailCard({ employee,team,manager, onEditClickHandler }) {
  const role = employee.is_manager ? "He/She is the manager of this team" : (manager ? manager.name : "Not assigned");
  const auth = useContext(AuthContext)
  
  return (
    <div className="data-container">
      <p>
        <strong>Name:</strong>
        {employee.name.charAt(0).toUpperCase() + employee.name.slice(1)}
      </p>

      <p>
        <strong>Email:</strong>
        {employee.email}
      </p>

      <p>
        <strong>Address:</strong>
        {employee.address}
      </p>

      <p>
        <strong>Mobile:</strong>
        {employee.mobile}
      </p>

      {team ? (
        <>
          <p>
            <strong>Team:</strong>
            {team.name.charAt(0).toUpperCase() + team.name.slice(1)}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
        </>
      ) : (
        <p>
          <strong>Team:</strong> haven't been assigned to a team yet.
        </p>
      )}

      {auth.isAdmin && (
        <Link to="#" onClick={onEditClickHandler} className="bi bi-pencil-square button-edit-top"></Link>
      )}
    </div>
  );
}