import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/", {state: { errorMessage: "Forbidden resource" },});
    }, [navigate]);

    return <></>;
};

export default Unauthorized;
