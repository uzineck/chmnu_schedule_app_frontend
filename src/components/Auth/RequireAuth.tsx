import React from "react";
import {useAuth} from "./AuthProvider.tsx";

interface RequireAuthProps {
    children: React.ReactNode;
    fallback?: React.ReactNode; // Optional fallback UI
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback = null }) => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <>{children}</> : <>{fallback}</>;
};

export default RequireAuth;
