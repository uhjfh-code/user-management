import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function AddUser() {
  const navigate = useNavigate();

  
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Add User</h2>
      <UserForm mode="add" onSuccess={handleSuccess} />
    </div>
  );
}
