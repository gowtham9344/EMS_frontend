import "./card.css"
import ActionCard from '../../shared/components/actionCard';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";
import { useContext } from "react";


export default function Card({detail,modalFunctions,setIsDelete}) {
  const auth = useContext(AuthContext);

  const handleClick = () => {
    modalFunctions.handleOpen(detail.id);
  };

  const handleDelete = async() => {
    const token = auth.token;
      try {
        const response = await fetch(`http://localhost:8000/teams/${detail.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
          },
        });
      
        if (!response.ok) {
          throw new Error("cannot able to delete it");
        }
        
        await response.json(); 
        toast.success("Team deleted successfully",auth.toastOptions)
        setIsDelete((prev)=>!prev)
      } catch (error) {
        toast.error("something went wrong please try again after sometimes",auth.toastOptions)
        console.error('Error:', error);
      }
  } 

    return (
      <div className="team-container">
        <Link className="team-link" onClick={handleClick}>
          <div className="team-details">
            <div className="detail">
              <strong>Name:</strong> {detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}
            </div>
            <div className="detail">
              <strong>Manager:</strong> {detail.manager_name ? detail.manager_name.charAt(0).toUpperCase() + detail.manager_name.slice(1) : "Not assigned"}
            </div>
          </div>
        </Link>
        {auth.isAdmin && (
          <ActionCard detail={detail} deleteHandler={handleDelete}/>
        )}
      </div>
    )
}