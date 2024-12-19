import {ClientRole} from "../../../models/enums/ClientRole.ts";
import {createContext} from "react";

interface RoleContextProps {
    matchesRole: (role: ClientRole) => boolean;
}

export const RoleContext = createContext<RoleContextProps | undefined>(undefined);