import axios from "axios";

// backend server address
const API_BASE = "http://localhost:4000/api";

export const api = axios.create({
    baseURL: API_BASE,
});