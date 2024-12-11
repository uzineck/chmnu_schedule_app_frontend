import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider.tsx";
import { logout } from "../../../api/client/auth.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";

const Logout = () => {
    const { logoutProp } = useAuth();
    const navigate = useNavigate();

    const { data, error, isLoading } = useFetchData(logout);

    useEffect(() => {
        if (!isLoading) {
            if (data) {
                logoutProp();
                navigate("/", { state: { logout_message: data.status } });
            } else if (error) {
                logoutProp();
                navigate("/", {
                    state: { logout_message: error },
                });
            }
        }
    }, [data, error, isLoading, logoutProp, navigate]);

    return null;
};

export default Logout;
