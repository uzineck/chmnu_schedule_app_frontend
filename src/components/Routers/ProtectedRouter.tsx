import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Context/AuthProvider.tsx";
import { useRole } from "../Auth/Context/RoleProvider.tsx";
import { ClientRole } from "../../models/enums/ClientRole.ts";

interface ProtectedRouteProps {
    role?: ClientRole;
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
    const { isLoggedIn } = useAuth();
    const { matchesRole } = useRole();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (role && !matchesRole(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
