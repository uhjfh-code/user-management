import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function AddUser() {
  const navigate = useNavigate();

  
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div>
      <UserForm mode="add" onSuccess={handleSuccess} />
    </div>
  );
}
