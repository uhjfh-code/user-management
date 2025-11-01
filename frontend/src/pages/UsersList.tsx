import "../styles/UsersList.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { Search } from "lucide-react";

interface User {
    id: number;
    customerNumber: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    lastLogin?: string;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("customerNumber");
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [search, sortBy, order]);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users", { params: { search, sortBy, order } });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
        }
    };

    const handelSort = (field: keyof User)=>{
        if(sortBy === field){
            setOrder(order === "asc" ? "desc" : "asc");
        }else{
            setSortBy(field);
            setOrder("asc");
        }
    };

    const handleAddUser = () => {
        navigate("/add-user");
    };

    const handleEdit = (id: number) => {
        navigate(`/edit-user/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await api.delete(`/users/${id}`);
            fetchUsers();
        }
    };

    const getSortIcon = (field: keyof User)=>{
        if(sortBy !== field) return "⇅";
        return order ==="asc" ? "↑" : "↓";
    };

    return (
        <div className="container">
            <div className="top-bar">
                <h1>User Management</h1>
                <div className="search-wrapper">
                    <input
                    className="search-bar"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                    
                <button className="search-btn" onClick={()=> fetchUsers}>
                    <Search size={18}  strokeWidth ={2}/>
                </button>
                </div>    
            </div>
            <button className="add-btn" onClick={handleAddUser}>add new</button>
            {users.length === 0 ?(
                <p style ={{marginTop: "20px", color: "#777"}}>
                    No users found. Please add a new user.
                </p>
            ):(
                <table>
                    <thead>
                        <tr>
                            <th onClick={()=> handelSort("customerNumber")}>
                                Customer Number {getSortIcon("customerNumber")}
                            </th>
                            <th onClick={() => handelSort("username")}>
                                Username {getSortIcon("username")}
                            </th>
                            <th onClick={() => handelSort("firstName")}>
                                First Name {getSortIcon("firstName")}
                            </th>
                            <th onClick={() => handelSort("lastName")}>
                                Last Name {getSortIcon("lastName")}
                            </th>
                            <th onClick={() => handelSort("email")}>
                                Email {getSortIcon("email")}
                            </th>
                            <th onClick={() => handelSort("lastLogin")}>
                                Last Login {getSortIcon("lastLogin")}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u)=>(
                            <tr key={u.id}>
                                <td>{u.customerNumber}</td>
                                <td>{u.username}</td>
                                <td>{u.firstName}</td>
                                <td>{u.lastName}</td>
                                <td>{u.email}</td>
                                <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-"}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(u.id)}>edit</button>
                                    <button className="delete-btn"  onClick={() => handleDelete(u.id)}>delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}