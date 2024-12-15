import React, {ReactNode} from "react";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import {useAuth} from "../hooks/useAuth.ts";
import {RoleContext} from "../RoleContext.ts";

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { client } = useAuth();

    const matchesRole = (role: ClientRole) => client?.role === role;

    const hasAnyRole = (roles: ClientRole[]) => roles.includes(client?.role || ClientRole.DEFAULT);

    return (
        <RoleContext.Provider value={{ matchesRole, hasAnyRole }}>
            {children}
        </RoleContext.Provider>
    );
};

