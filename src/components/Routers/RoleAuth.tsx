import React, { ReactNode } from "react";
import {useRole} from "../Auth/Context/RoleProvider.tsx";
import {ClientRole} from "../../models/enums/ClientRole.ts";


interface RoleProtectedRouterProps {
    role: ClientRole;
    children: ReactNode;
    fallback?: ReactNode;
}

export const RoleProtectedRouter: React.FC<RoleProtectedRouterProps> = ({ role, children, fallback = null }) => {
    const { matchesRole } = useRole();
    return matchesRole(role) ? <>{children}</> : <>{fallback}</>;
};
