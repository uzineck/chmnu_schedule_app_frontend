import React from "react";
import { Navigate } from "react-router-dom";
import { ClientRole } from "../../models/enums/ClientRole.ts";
import {useAuth} from "../Auth/Context/hooks/useAuth.ts";
import {useRole} from "../Auth/Context/hooks/useRole.ts";

interface ProtectedRouteProps {
    roles?: ClientRole[];
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
    const { isLoggedIn, loading } = useAuth();
    const { matchesRole } = useRole();

    if (loading) {
        // Avoid bouncing to /login before the initial client-info hydration
        // settles. Returning null is fine — the rest of the app (Header,
        // public routes, etc.) is already visible because AuthProvider no
        // longer gates its children.
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !matchesRole(roles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
