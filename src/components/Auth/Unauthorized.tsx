import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/", {state: { errorMessage: "Немає прав доступу до цього ресурсу" },});
    }, [navigate]);

    return <></>;
};

export default Unauthorized;
