import { useEffect, useState } from "react";
import { api } from "../api"

interface UserFormProps {
    mode: "add" | "edit";
    userId?: string;
    onSuccess: () => void;
}

export default function UserForm({ mode, userId, onSuccess }: UserFormProps) {
    const isEdit = mode === "edit";

    const [formData, setFormData] = useState({
        customerNumber: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        password: "",
        repeatPassword: "",
        lastLogin: mode === "add" ? new Date().toISOString() : "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit && userId) {
            api.get(`/users/${userId}`)
                .then((res) => {
                    const u = res.data;
                    setFormData({
                        ...u,
                        dateOfBirth: u.dateOfBirth.split("T")[0],
                        password: "",
                        repeatPassword: "",
                        lastLogin: u.lastLogin
                            ? new Date(u.lastLogin).toLocaleString()
                            : "-",
                    });
                })
                .catch(() => setError("Failed to load user data"))
                .finally(() => setLoading(false));
        }
    }, [isEdit, userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password && formData.password !== formData.repeatPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const dataToSend: any = { ...formData };
            delete dataToSend.repeatPassword;
            if (!dataToSend.password) delete dataToSend.password;

            if (isEdit) {
                await api.put(`/users/${userId}`, dataToSend);
                alert("User updated successfully!");
            } else {
                await api.post("/users", dataToSend);
                alert("User added successfully!");
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError(`Failed to ${isEdit ? "update" : "add"} user`);
        }
    };

    if (loading) return <p>Loading...</p>;



    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
            <input
                name="customerNumber"
                placeholder="Customer Number (5 digits)"
                value={formData.customerNumber}
                onChange={handleChange}
                required
                readOnly={isEdit}
            />

            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                readOnly={isEdit}
            />

            <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
            />

            <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
            />

            {isEdit && (
                <input
                    name="lastLogin"
                    value={formData.lastLogin}
                    readOnly
                    placeholder="Last Login"
                />
            )}

            <input
                name="password"
                type="password"
                placeholder={isEdit ? "New Password (optional)" : "Password"}
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
            />

            <input
                name="repeatPassword"
                type="password"
                placeholder="Repeat Password"
                value={formData.repeatPassword}
                onChange={handleChange}
                required={!isEdit}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">{isEdit ? "Save Changes" : "Create User"}</button>
        </form>
    );
}