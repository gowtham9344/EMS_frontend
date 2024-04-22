import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/authContext';

export default function TeamDetailCard({team, manager, employees, onEditClickHandler}) {
    const auth = useContext(AuthContext)

    return (
        <div className="data-container">
            {team && 
                    <>
                    <p>
                    <strong>Team Name :</strong>
                    {team.name.charAt(0).toUpperCase() + team.name.slice(1)  }
                    </p>

                    <p>
                    <strong>Manager :</strong>
                    {manager ? manager.name.charAt(0).toUpperCase() + manager.name.slice(1) : "Not assigned"}
                    </p>
                    </>
                }   

                {employees.length > 0 ? (
                    <>
                    <p><strong>Team Members:</strong></p>
                    <div className="member-select-dropdown1">
                        <ul>
                        {employees.map((employee) => {
                            console.log(employee)
                            return <li key={employee.id}>{employee.name.charAt(0).toUpperCase() + employee.name.slice(1)}</li>
                        })}
                        </ul>
                    </div>
                </>
                ) : (
                    <p>Currently, there are no members in this team.</p>
                )}

                {team && auth.isAdmin && (
                    <Link onClick={onEditClickHandler} className="bi bi-pencil-square button-edit-top"></Link>
                )}
        </div>
    );
}