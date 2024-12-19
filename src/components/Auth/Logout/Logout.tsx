import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../api/client/auth.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import {useAuth} from "../Context/hooks/useAuth.ts";

const Logout = () => {
    const { logoutProp } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const { data, error, isLoading } = useFetchData(logout);

    useEffect(() => {
        messageApi.loading({ content: 'Loading...' });
        if (!isLoading) {
            if (data) {
                logoutProp();
                messageApi.destroy();
                navigate("/", {
                    state: { successMessage: data.status },
                });
            } else if (error) {
                logoutProp();
                messageApi.destroy();
                navigate("/", {
                    state: { errorMessage: error },
                });
            }
        }
    }, [data, error, isLoading, logoutProp, navigate, messageApi]);

    return <>{contextHolder}</>;
};

export default Logout;
