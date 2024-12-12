import React, {createContext, ReactNode, useContext} from "react";
import {useAuth} from "./AuthProvider.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";

interface RoleContextProps {
    matchesRole: (role: ClientRole) => boolean;
    hasAnyRole: (roles: ClientRole[]) => boolean;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

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

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
};
