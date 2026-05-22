import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../Context/hooks/useAuth.ts";

const Logout = () => {
    const { logoutProp } = useAuth();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const didRunRef = useRef(false);

    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;

        let cancelled = false;
        messageApi.loading({ key: "logout", content: "Завантаження..." });

        (async () => {
            await logoutProp();
            if (cancelled) return;
            messageApi.destroy("logout");
            navigate("/", {
                state: { successMessage: "Вихід успішно виконано" },
                replace: true,
            });
        })();

        return () => {
            cancelled = true;
        };
    }, [logoutProp, navigate, messageApi]);

    return <>{contextHolder}</>;
};

export default Logout;
