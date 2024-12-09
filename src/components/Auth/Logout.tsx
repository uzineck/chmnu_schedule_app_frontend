import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.tsx";
import { logout } from "../../api/client/auth.ts";

const Logout = () => {
    const { logoutProp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const response = await logout();
            logoutProp();
            navigate("/", { state: { logout_message: response.data.status } });
        };

        handleLogout();
    }, [logoutProp, navigate]);

    return null;
};

export default Logout;
