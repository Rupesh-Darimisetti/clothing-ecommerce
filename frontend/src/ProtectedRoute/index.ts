import Cookie from "js-cookie";
import type React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = Cookie.get("jwt_token");
    const navigate = useNavigate()
    if (!token) {
        return navigate('/login');
    }

    return { children };
};

export default ProtectedRoute;
