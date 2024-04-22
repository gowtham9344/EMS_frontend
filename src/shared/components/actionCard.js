import { Link } from 'react-router-dom';
import "./actionCard.css"

export default function ActionCard({deleteHandler}) {
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete?')) {
          deleteHandler();
        }
      };

    return (
        <div className="actions">
            <Link
              onClick={handleDelete}
              className="bi bi-trash3-fill"
            ></Link>
        </div>
    )
}