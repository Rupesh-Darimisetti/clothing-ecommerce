import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

export default api;
