import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AddUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerNumber: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        password: "",
        repeatPassword: ""
    });

    const [error, setError] = useState("");

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // validation
        if(formData.password !== formData.repeatPassword){
            setError("Passwords do not match!");
            return;
        }

        try {
            await api.post("/users", formData);
            alert("User added successfully!");
            navigate("/"); //back to UserList(index)
        } catch (err) {
            console.error(err);
            setError("Failed to add user. Please try again.");
        }
    };

    return(
        <div style={{ maxWidth: "500px", margin: "30px auto"}}>
            <h1>Add User</h1>
            <form onSubmit={handelSubmit} style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <input
                name="customerNumber"
                placeholder="Customer Number (5 digits)"
                value={formData.customerNumber}
                onChange={handelChange}
                required/>

                <input
                name="username"
                placeholder="Username (3-30 chars)"
                value={formData.username}
                onChange={handelChange}
                required/>
                <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handelChange}
                required/>
                <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handelChange}
                required/>
                <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handelChange}
                required/>
                <input
                name="dateOfBirth"
                type="date"
                placeholder="dd/mm/yyyy"
                value={formData.dateOfBirth}
                onChange={handelChange}
                required/>
                <input
                name="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handelChange}
                required/>
                <input
                name="repeatPassword"
                type="password"
                placeholder="Repeat Password"
                value={formData.repeatPassword}
                onChange={handelChange}
                required/>

                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit">Save</button>
            </form>
        </div>
    );
}