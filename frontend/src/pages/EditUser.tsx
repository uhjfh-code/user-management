import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();


  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Edit User</h2>
      {id ? (
        <UserForm mode="edit" userId={id} onSuccess={handleSuccess} />
      ) : (
        <p>User ID not found.</p>
      )}
    </div>
  );
}
