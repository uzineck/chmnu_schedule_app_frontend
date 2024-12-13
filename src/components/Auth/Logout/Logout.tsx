import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider.tsx";
import { logout } from "../../../api/client/auth.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";

const Logout = () => {
    const { logoutProp } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const { data, error, isLoading } = useFetchData(logout);

    useEffect(() => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...',
        });
        if (!isLoading) {
            if (data) {
                logoutProp();
                messageApi.destroy();
                navigate("/", {
                    state: { logoutMessage: "Logged out successfully!" },
                });
            } else if (error) {
                logoutProp();
                messageApi.destroy();
                navigate("/", {
                    state: { logoutMessageError: error },
                });
            }
        }
    }, [data, error, isLoading, logoutProp, navigate, messageApi]);

    return <>{contextHolder}</>;
};

export default Logout;
