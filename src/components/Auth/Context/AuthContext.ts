import {ClientPrivate} from "../../../models/client/ClientPrivate.ts";
import {createContext} from "react";

interface AuthContextProps {
    isLoggedIn: boolean;
    client: ClientPrivate | null;
    loginProp: (accessToken: string, refreshToken: string) => void;
    logoutProp: () => void;
    updateClient: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);